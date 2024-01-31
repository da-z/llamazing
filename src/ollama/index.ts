import * as utils from "./utils.js";

import type {
  ChatRequest,
  ChatResponse,
  Config,
  EmbeddingsRequest,
  EmbeddingsResponse,
  ErrorResponse,
  Fetch,
  GenerateRequest,
  GenerateResponse,
  ListResponse,
  ProgressResponse,
  PullRequest,
  PushRequest,
  ShowRequest,
  ShowResponse,
} from "./interfaces.js";

export class Ollama {
  private readonly config: Config;
  private readonly fetch: Fetch;

  constructor(config?: Partial<Config>) {
    this.config = {
      host: utils.formatHost(config?.host ?? "http://localhost:11434"),
    };

    this.fetch = fetch;
    if (config?.fetch != null) {
      this.fetch = config.fetch;
    }
  }

  private async processStreamableRequest<T extends object>(
    endpoint: string,
    request: { stream?: boolean } & Record<string, any>,
  ): Promise<T | AsyncGenerator<T>> {
    request.stream = request.stream ?? false;
    const response = await utils.post(
      this.fetch,
      `${this.config.host}/api/${endpoint}`,
      {
        ...request,
      },
    );

    if (!response.body) {
      throw new Error("Missing body");
    }

    const itr = utils.parseJSON<T | ErrorResponse>(response.body);

    if (request.stream) {
      return (async function* () {
        for await (const message of itr) {
          if ("error" in message) {
            throw new Error(message.error);
          }
          yield message;
          // message will be done in the case of chat and generate
          // message will be success in the case of a progress response (pull, push, create)
          if ((message as any).done || (message as any).status === "success") {
            return;
          }
        }
        throw new Error("Did not receive done or success response in stream.");
      })();
    } else {
      const message = await itr.next();
      if (!message.value.done && (message.value as any).status !== "success") {
        throw new Error("Expected a completed response.");
      }
      return message.value;
    }
  }

  chat(
    request: ChatRequest & { stream: true },
  ): Promise<AsyncGenerator<ChatResponse>>;
  chat(request: ChatRequest & { stream?: false }): Promise<ChatResponse>;

  async chat(
    request: ChatRequest,
  ): Promise<ChatResponse | AsyncGenerator<ChatResponse>> {
    return this.processStreamableRequest<ChatResponse>("chat", request);
  }

  generate(
    request: GenerateRequest & { stream: true },
  ): Promise<AsyncGenerator<GenerateResponse>>;
  generate(
    request: GenerateRequest & { stream?: false },
  ): Promise<GenerateResponse>;

  async generate(
    request: GenerateRequest,
  ): Promise<GenerateResponse | AsyncGenerator<GenerateResponse>> {
    return this.processStreamableRequest<GenerateResponse>("generate", request);
  }

  pull(
    request: PullRequest & { stream: true },
  ): Promise<AsyncGenerator<ProgressResponse>>;
  pull(request: PullRequest & { stream?: false }): Promise<ProgressResponse>;

  async pull(
    request: PullRequest,
  ): Promise<ProgressResponse | AsyncGenerator<ProgressResponse>> {
    return this.processStreamableRequest<ProgressResponse>("pull", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure,
      username: request.username,
      password: request.password,
    });
  }

  push(
    request: PushRequest & { stream: true },
  ): Promise<AsyncGenerator<ProgressResponse>>;
  push(request: PushRequest & { stream?: false }): Promise<ProgressResponse>;

  async push(
    request: PushRequest,
  ): Promise<ProgressResponse | AsyncGenerator<ProgressResponse>> {
    return this.processStreamableRequest<ProgressResponse>("push", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure,
      username: request.username,
      password: request.password,
    });
  }

  async list(): Promise<ListResponse> {
    const response = await utils.get(
      this.fetch,
      `${this.config.host}/api/tags`,
    );
    const listResponse = (await response.json()) as ListResponse;
    return listResponse;
  }

  async show(request: ShowRequest): Promise<ShowResponse> {
    const response = await utils.post(
      this.fetch,
      `${this.config.host}/api/show`,
      {
        ...request,
      },
    );
    const showResponse = (await response.json()) as ShowResponse;
    return showResponse;
  }

  async embeddings(request: EmbeddingsRequest): Promise<EmbeddingsResponse> {
    const response = await utils.post(
      this.fetch,
      `${this.config.host}/api/embeddings`,
      {
        ...request,
      },
    );
    const embeddingsResponse = (await response.json()) as EmbeddingsResponse;
    return embeddingsResponse;
  }
}

export default new Ollama();

// export all types from the main entry point so that packages importing types dont need to specify paths
export * from "./interfaces.js";
