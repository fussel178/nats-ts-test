/**
 * Registers a handler onto an async iterable.
 * The handler gets called once new data arrives ot the iterable.
 * @param iterable the asynchronous iterable on which new data arrives
 * @param handler the handler that gets the received data from the iterable
 */
export function registerHandler<T>(iterable: AsyncIterable<T>, handler: (data: T) => void): void {
    (async () => {
        for await (const data of iterable) {
            handler(data);
        }
    })();
}
