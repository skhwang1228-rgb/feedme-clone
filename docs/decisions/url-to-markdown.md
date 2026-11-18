# URL 변환과 LLM 넘기기 방식

## Decisions

- 변환 결과를 ChatGPT·Claude로 넘길 때는 `[프롬프트 + Markdown 본문]`을 클립보드에 복사하고 새 채팅을 새 탭으로 엽니다. 본문을 `?q=` 같은 URL 파라미터에 싣지 않습니다.
- 본문 추출과 Markdown 변환은 `defuddle`을 사용하고, 서버에서 `linkedom` 또는 `jsdom`과 함께 씁니다.
- 외부 페이지는 브라우저가 아니라 서버에서 가져옵니다.
- 프롬프트(직접 입력 포함)는 저장하지 않습니다.

## Why

`?q=` 방식은 URL 길이 한계 때문에 긴 문서를 담지 못합니다. 위키피디아 문서 하나가 약 3만 4천 자입니다. 붙여넣기 한 번이 더 필요하지만 본문 길이와 관계없이 항상 동작하는 쪽으로 사용자가 확정했습니다.

외부 페이지는 CORS 때문에 브라우저에서 직접 가져오지 못하는 경우가 많습니다. `defuddle`은 사용자 요구였고, 서버에서 `linkedom`이나 `jsdom`과 함께 쓰는 구성이 `https://en.wikipedia.org/wiki/Markdown`과 `https://defuddle.md/docs`에서 제목·저자·본문 추출에 모두 성공했습니다(2026-11-18, defuddle 0.19.6).

## Boundaries

- 로그인이 필요한 페이지와 JS로만 그려지는 페이지는 지원 대상이 아닙니다.

## Still-rejected alternatives

- URL 파라미터(`?q=`)로 본문 전달 — 긴 문서에서 잘리거나 실패합니다.
- 브라우저에서 직접 페이지 가져오기 — CORS로 막히는 사이트가 많습니다.
