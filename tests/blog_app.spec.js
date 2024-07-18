const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        
        await page.goto('/')
    })

    describe('Log in', () => {
        test('front page can be opened', async ({ page }) => {
            const locator = await page.getByText('blogs')
            await expect(locator).toBeVisible()
        })
    
        test('login form can be opened', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
    
            await expect(page.getByText('Matti Luukkainen')).toBeVisible()
        })

        test('failed if password is wrong', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'wrongPass123')
    
            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('wrong credentials')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

            await expect(page.getByText('Matti Luukkainen')).not.toBeVisible()
        })
    })
    
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, {
                title: 'test title e2e',
                author: 'test author e2e',
                url: 'http://testUrlE2e.com'
            })

            await expect(page.getByText('test title e2e')).toBeVisible()
        })

        test.skip('blog can be liked', async ({ page }) => {
            await createBlog(page, {
                title: 'title to like e2e',
                author: 'test author e2e',
                url: 'http://testUrlE2e.com'
            })

            const locator = await page.getByText('title to like e2e').locator('..')

            const viewButton = await locator.getByRole('button', { name: 'view' })
            await viewButton.click()

            const likes = await locator.getByText('likes 0')

            const likeButton = await locator.getByRole('button', { name: 'like' })
            await likeButton.click()

            await expect(likes).toContainText('likes 1')
        })

        test.skip('blog can be deleted', async ({ page }) => {
            await createBlog(page, {
                title: 'title to delete e2e',
                author: 'test author e2e',
                url: 'http://testUrlE2e.com'
            })

            const locator = await page.getByText('title to delete e2e').locator('..')

            const viewButton = await locator.getByRole('button', { name: 'view' })
            await viewButton.click()

            const removeButton = await locator.getByRole('button', { name: 'remove' })
            await removeButton.click()
            page.on('dialog', dialog => dialog.accept())

            await expect(locator).not.toBeVisible()
        })
    })
})
