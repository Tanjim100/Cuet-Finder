// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Login should work', async ({ page }) => {
  // Navigate to the login page
  await page.goto('http://localhost:5173/login');

  // Fill in the email and password fields using the correct selectors
  await page.fill('input[name="email"]', 'kayes@gmail.com');
  await page.fill('input[name="password"]', 'kayes');

  // Click the submit button
  await page.click('button[type="submit"]');

  // // Wait for navigation to complete (if necessary)
  // await page.waitForURL('http://localhost:5173');

  // Assert that the URL has changed to the home page
  await expect(page).toHaveURL('http://localhost:5173')

});

test('Report Lost Item Form Submission', async ({ page }) => {
  // Navigate to the Report Lost page
  await page.goto('http://localhost:5173/reportlost');

  // Fill out the form fields
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="item"]', 'Wallet');
  await page.fill('input[name="location"]', 'Central Park');
  await page.fill('input[name="date"]', '2023-10-15'); // Use a valid date format
  await page.fill('textarea[name="description"]', 'A black leather wallet with credit cards inside.');
  await page.fill('input[name="contact"]', 'john.doe@example.com');

  // Upload a file
  await page.setInputFiles('input[name="photo"]', 'Frontend/public/id_card.jpg'); // Replace with the path to a test image

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation or a success message
  page.on('dialog', async dialog => {
    // Verify if the dialog is an alert
    if (dialog.type() === 'alert') {
      console.log('Alert message:', dialog.message());
      // You can accept or dismiss the alert here
      await dialog.accept();  // Close the alert (accept it)
    }
  })
  // await page.waitForURL('http://localhost:5173/lost'); // Adjust the URL if necessary

  // Verify the URL after submission
  await expect(page).toHaveURL('http://localhost:5173/reportlost');

  // Optionally, verify a success message or other UI changes
  // const successMessage = await page.locator('.success-message'); // Adjust the selector if you have a success message
  // await expect(successMessage).toBeVisible();
});

test('Post Found Item Form Submission', async ({ page }) => {
  // Navigate to the Report Lost page
  await page.goto('http://localhost:5173/reportfound');

  // Fill out the form fields
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="item"]', 'Wallet');
  await page.fill('input[name="location"]', 'Central Park');
  await page.fill('input[name="date"]', '2023-10-15'); // Use a valid date format
  await page.fill('textarea[name="description"]', 'A black leather wallet with credit cards inside.');
  await page.fill('input[name="contact"]', 'john.doe@example.com');

  // Upload a file
  await page.setInputFiles('input[name="photo"]', 'Frontend/public/id_card.jpg'); // Replace with the path to a test image

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation or a success message
  page.on('dialog', async dialog => {
    // Verify if the dialog is an alert
    if (dialog.type() === 'alert') {
      console.log('Alert message:', dialog.message());
      // You can accept or dismiss the alert here
      await dialog.accept();  // Close the alert (accept it)
    }
  })
  // await page.waitForURL('http://localhost:5173/lost'); // Adjust the URL if necessary

  // Verify the URL after submission
  await expect(page).toHaveURL('http://localhost:5173/reportfound');

  // Optionally, verify a success message or other UI changes
  // const successMessage = await page.locator('.success-message'); // Adjust the selector if you have a success message
  // await expect(successMessage).toBeVisible();
});