# .md 다운로드 직후 revokeObjectURL 호출

`features/url-to-markdown/components/export-panel.tsx`의 `onDownload`가 `a.click()` 직후 `URL.revokeObjectURL`을 동기 호출한다. Safari 등 일부 브라우저에서 다운로드가 비거나 실패할 수 있다는 코드 리뷰 지적이며, Chromium에서는 재현되지 않았다(미확인 상태로 기록). 필요하면 `setTimeout`으로 해제를 미룬다.
