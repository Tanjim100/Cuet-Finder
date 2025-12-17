// const { test, expect } = require('@playwright/test');

// test('Login should navigate to the correct page after successful login', async ({ page }) => {
//   // Go to the login page
//   await page.goto('http://localhost:5173/login');

//   // Fill the email and password fields
//   await page.fill('input[name="email"]', 'kayes@gmail.com');
//   await page.fill('input[name="password"]', 'kayes');

//   // Click the login button
//   await page.click('button[type="submit"]');

//   // Wait for the page to navigate (you can wait for any element that appears after login)
//   await page.waitForNavigation();

//   // Check if we are navigated to the correct page (e.g., home page or a protected route)
//   await expect(page).toHaveURL('http://localhost:5173/'); // or any other URL based on your app

//   // Check if a logged-in user element is visible (e.g., profile icon, logout button)
//   await expect(page.locator('nav .profile-icon')).toBeVisible();
// });

// test('Login should show error message for incorrect credentials', async ({ page }) => {
//   // Go to the login page
//   await page.goto('http://localhost:5173/login');

//   // Fill in invalid credentials
//   await page.fill('input[name="email"]', 'invalidemail@gmail.com');
//   await page.fill('input[name="password"]', 'wrongpassword');

//   // Click the login button
//   await page.click('button[type="submit"]');

//   // Wait for error message to appear (You can use any error message that your app shows)
//   const errorMessage = await page.locator('.error-message'); // Change this according to your error message class or selector
//   await expect(errorMessage).toHaveText('Invalid credentials'); // Ensure the correct error message is shown
// });
