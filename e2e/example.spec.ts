import { expect, test } from "@playwright/test"

// 这是一个使用 Playwright 的端到端测试文件，用来验证首页的标题是否正确。
test("has title", async ({ page }) => {
  await page.goto("./")

  await expect(page).toHaveTitle(/Next.js Enterprise Boilerplate/)
})
