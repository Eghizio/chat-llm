type S = ReadableStreamReadResult<Uint8Array<ArrayBufferLike>>;

const API_URL = "http://localhost:3001/api/v1/chat";

export const streamCompletion = async (
  prompt: string,
  processChunk: (chunk: string) => void = () => {}
): Promise<string> => {
  const url = new URL(API_URL);
  url.searchParams.append("prompt", prompt);

  let chunks = "";

  const onChunk = (chunk: string) => {
    chunks += chunk;
    processChunk(chunk);
  };

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.body) {
          // console.log("No response body.");
          return;
        }

        const reader = response.body.getReader();

        const pump = async ({ done, value }: S): Promise<S | undefined> => {
          const chunk = new TextDecoder().decode(value);

          if (done) {
            // Do something with last chunk of data then exit reader
            onChunk(chunk);
            resolve(chunks);
            return;
          }

          if (!value) {
            console.log("No value");
            return;
          }

          // Otherwise do something here to process current chunk
          onChunk(chunk);

          // Read some more, and call this function again
          return reader.read().then(pump);
        };

        return reader.read().then(pump);
      })
      .catch(reject);
  });
};
