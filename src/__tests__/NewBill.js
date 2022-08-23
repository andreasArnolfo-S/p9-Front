/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { waitFor } from '@testing-library/dom';

/*-------andreas-------*/

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("should render a New Bill form", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBillForm = screen.getByTestId('form-new-bill')
      expect(newBillForm).toBeTruthy()
    })

    test("Then it should render 8 entries", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const expenseTypeInput = screen.getByTestId('expense-type')
      expect(expenseTypeInput).toBeTruthy()

      const expenseNameInput = screen.getByTestId('expense-name')
      expect(expenseNameInput).toBeTruthy()

      const datePicker = screen.getByTestId('datepicker')
      expect(datePicker).toBeTruthy()

      const amountInput = screen.getByTestId('amount')
      expect(amountInput).toBeTruthy()

      const vatInput = screen.getByTestId('vat');
      expect(vatInput).toBeTruthy()

      const pctInput = screen.getByTestId('pct');
      expect(pctInput).toBeTruthy()

      const commentary = screen.getByTestId('commentary');
      expect(commentary).toBeTruthy()

      const fileInput = screen.getByTestId('file');
      expect(fileInput).toBeTruthy()
    })

    describe("When I add an non-image file as bill proof", () => {
      test("i cant submit and alert appear", () => {
        const html = NewBillUI()
        document.body.innerHTML = html
        const fileInput = screen.getByTestId('file');
        fileInput.file = [new File([""], "test.txt", { type: "text/plain" })]
        const submitButton = screen.getByTestId('submit-button')
        submitButton.click()
        global.alert = jest.fn()
        expect(global.alert).toBeTruthy()
      })
    })

    // /* test error 404 */
    // test("Then it should render an error 404", async () => {
    //   const html = NewBillUI({ error: 'Erreur 404' })
    //   document.body.innerHTML = html
    //   const message = await screen.getByText(/Erreur 404/)
    //   expect(message).toBeTruthy()
    // })

    // /* test error 500 */
    // test("Then it should render an error 500", async () => {
    //   const html = NewBillUI({ error: 'Erreur 500' })
    //   document.body.innerHTML = html
    //   const message = await screen.getByText(/Erreur 500/)
    //   expect(message).toBeTruthy()
    // })


  })
})
