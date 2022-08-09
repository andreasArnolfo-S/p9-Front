/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { waitFor } from '@testing-library/dom';


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

    })
    // describe("when i submit the new bill", () => {
    //   /* Checking if the new bill is added on list of bills */
    //   test("Then new bill should be added on list of bills", async () => {

    //     const html = NewBillUI()
    //     document.body.innerHTML = html
    //     const newBill = {
    //       id: '1',
    //       date: '2025-01-01',
    //       amount: '100',
    //       description: 'test',
    //       name: 'test',
    //       Image: 'test.png'
    //     }

    //     const newBillForm = screen.getByTestId('form-new-bill')
    //     newBillForm.submit(newBill)
    //     await waitFor(() => screen.getByTestId('tbody'))
    //     const bill = screen.getByTestId('tbody')
    //     expect(bill.length).toEqual(12)
    //   })
    // })
  })
})
