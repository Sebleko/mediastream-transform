
type ReadableStreamController = ReadableStreamDefaultController; // | ReadableByteStreamController;

class CircularBuffer<T> {
    constructor(max_size?: number){

    }

    isEmpty(): boolean {
        throw new Error("Method not implemented.");
    }

    deque(): T {
        throw new Error("Method not implemented.");
    } 
}

export default class MediaStreamTrackProcessor<T extends AudioData | VideoFrame> {
    private track_: MediaStreamTrack;
    private maxBufferSize_?: number;
    private queue_: CircularBuffer<T>;
    private numPendingReads_: number;
    private isClosed_: boolean;

    private readable_?: ReadableStream;
    public get readable(): ReadableStream {
        if (this.readable_) return this.readable_;
        const stream = new ReadableStream({
                pull: this.processorPull_,
                cancel: this.processorCancel_,
            }, 
            { highWaterMark: 0, },
        );
        return this.readable_ || (this.readable_ = stream && stream);
    }

    constructor(init: MediaStreamTrackProcessorInit){
        if (!(init.track instanceof MediaStreamTrack)){
            throw new TypeError("init.track was not instance of MediaStreamTrack");
        };

        this.track_ = init.track;
        
        this.maxBufferSize_ = (init.maxBufferSize! >= 1) ? init.maxBufferSize : undefined;
        this.queue_ = new CircularBuffer(this.maxBufferSize_);
        this.numPendingReads_ = 0;
        this.isClosed_ = false;
    }

    
    private processorPull_(controller: ReadableStreamController): Promise<undefined>{
        this.numPendingReads_ += 1;

        // Really, in a way this is a job (not a task)
        return new Promise((resolve, reject) => {
            try {
                this.maybeReadFrame_(controller);
                resolve(undefined);
            } catch(e) {
                reject(e);
            }
        });
    }
    
    private processorCancel_(controller: ReadableStreamController){
        throw new Error("Method not implemented.");
    }
    
    private maybeReadFrame_(controller: ReadableStreamController){
        
        while (!this.queue_.isEmpty() && this.numPendingReads_ != 0){
            controller.enqueue(this.queue_.deque());
            this.numPendingReads_ -= 1
        }
    }
}

