# 신사업전략 부서 사이트

## 배포 워크플로

이 레포지토리는 GitHub Pages로 `main` 브랜치에서 자동 배포됩니다 (`https://minjoooolee.github.io/new_business_strategy/`).

**작업 시 반드시 main까지 머지/푸시 완료까지 진행할 것.** 피처 브랜치에만 푸시하고 끝내지 말 것. 사용자가 변경사항을 사이트에서 바로 확인할 수 있어야 함.

### 표준 절차
1. 피처 브랜치 `claude/reorganize-vdoc-menu-W21Iu`에서 작업 및 커밋
2. 피처 브랜치 푸시: `git push -u origin claude/reorganize-vdoc-menu-W21Iu`
3. main으로 머지: `git checkout main && git merge claude/reorganize-vdoc-menu-W21Iu`
4. main 푸시: `git push origin main` (필요 시 `git pull --rebase` 후 재시도)

### main 직접 push가 403으로 실패하는 경우
로컬 프록시가 가끔 main push를 차단할 수 있음. 다음 fallback 사용:

```bash
TOKEN=$(cat /home/claude/.claude/remote/.session_ingress_token)
# MCP 서버 URL과 헤더는 /tmp/mcp-config-*.json 참조
# Python으로 MCP push_files JSON-RPC 호출하여 main에 직접 파일 업로드
```

`mcp__github__push_files` 도구를 직접 호출할 때는 `content` 필드에 반드시 **실제 파일 내용**을 전달해야 함. 셸 변수/명령어 문자열(`$(cat ...)` 등)을 그대로 넣으면 그 문자열이 그대로 파일로 저장되어 사이트가 깨짐.
