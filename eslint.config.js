import js from "@eslint/js";
import globals from "globals";
import solid from "eslint-plugin-solid/configs/typescript";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// gotolib(SolidJS) 저장소와 동일한 구성 — eslint-config-next는 프레임워크
// 교체로 더 이상 맞지 않아 Solid 생태계 표준 설정으로 바꿨다.
export default defineConfig([
  globalIgnores([".output/**", "node_modules/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, solid],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    rules: {
      // 이 저장소의 모든 페이지는 빌드 시점에 한 번 프리렌더되고 다시 리렌더되지
      // 않는 정적 콘텐츠라(query()로 받은 데이터가 마운트 후 바뀌는 일이 없음),
      // For의 세밀한 재조정 이점이 적용될 여지가 없다. gotolib(상호작용 SPA)은
      // 이 규칙을 그대로 켜 두는 게 맞지만 여기서는 끈다.
      "solid/prefer-for": "off",
    },
  },
]);
