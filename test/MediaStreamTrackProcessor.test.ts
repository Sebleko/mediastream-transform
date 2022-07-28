import MediaStreamTrackProcessor from '../src/MediaStreamTrackProcessor'

test("The maximum size of the queue will not exceed the size requested by the application.", () => {

})

test("If a new frame arrives and the internal buffer is full the oldest frame in the buffer gives way", () => {

})

test("The order of the frames must stay intact.", () => {})

test("The processor makes frames available to its associated ReadableStream only when a read request has been issued on the stream.", () => {})


describe('Test constructor', () => { 
    test("If init.track is not a valid MediaStreamTrack, throw a TypeError.", () => {
        const init = {
            track: "This is not a MediaStreamTrack." as unknown as MediaStreamTrack,
        }
        expect(new MediaStreamTrackProcessor(init)).toThrowError(TypeError);
    })

    test()
 })

