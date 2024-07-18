const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill(content.title)
    await page.getByRole('textbox', { name: 'author' }).fill(content.author)
    await page.getByRole('textbox', { name: 'url' }).fill(content.url)
    await page.getByRole('button', { name: 'create' }).click()
}

module.exports = { loginWith, createBlog }