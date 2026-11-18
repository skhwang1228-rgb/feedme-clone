// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { stashPending, takePending } from "./pending";

const draft = {
  title: "글",
  author: "",
  site: "example.com",
  wordCount: 3,
  markdown: "본문",
  url: "https://example.com/a",
};

describe("pending", () => {
  beforeEach(() => sessionStorage.clear());

  it("보존한 결과를 한 번만 꺼낸다", () => {
    stashPending(draft);
    expect(takePending()).toEqual(draft);
    expect(takePending()).toBeNull();
  });

  it("보존한 결과가 없거나 깨졌으면 null이다", () => {
    expect(takePending()).toBeNull();
    sessionStorage.setItem("pending-save", "{not json");
    expect(takePending()).toBeNull();
  });
});
