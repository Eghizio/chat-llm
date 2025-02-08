type S = ReadableStreamReadResult<Uint8Array<ArrayBufferLike>>;

const API_URL = "http://localhost:3001/api/v1/chat";

export const streamCompletion = async (
  prompt: string,
  processChunk: (chunk: string) => void = () => {}
) => {
  const url = new URL(API_URL);
  url.searchParams.append("prompt", prompt);

  return (
    fetch(url)
      // Retrieve its body as ReadableStream
      .then((response) => {
        if (!response.body) {
          // console.log("No response body.");
          return;
        }

        const reader = response.body.getReader();

        const pump = async ({ done, value }: S): Promise<S | undefined> => {
          if (!value) {
            //   console.log("No value");
            return;
          }

          const chunk = new TextDecoder().decode(value);

          if (done) {
            // Do something with last chunk of data then exit reader
            processChunk(chunk);
            return;
          }

          // Otherwise do something here to process current chunk
          processChunk(chunk);

          // Read some more, and call this function again
          return reader.read().then(pump);
        };

        return reader.read().then(pump);
      })
  );
};
