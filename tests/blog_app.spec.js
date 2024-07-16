const { test, expect } = require('@playwright/test')
const { describe, beforeEach } = require('node:test')

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })
    
    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
    })

    test('login form can be opened', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Matti Luukkainen')).toBeVisible()
    })
})
