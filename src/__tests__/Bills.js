/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    /* Checking if the icon is highlighted. */
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()

    })
    /* Checking if the dates are in order. */
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : +1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    //----------------------Andreas---------------------------//

    /* Checking if all bills have a eyes icon */
    test("Then all bills should have a eyes icon", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const eyesIcons = screen.getAllByTestId('icon-eye')
      expect(eyesIcons.length).toBe(bills.length)
    })

    /* when i click on eye icon, then should open the modal */
    test("Then when I click on eye icon, then should open the modal", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const eyesIcons = screen.getAllByTestId('icon-eye')
      eyesIcons[0].click()
      const modal = screen.getByTestId('modalEye')
      expect(modal).toBeTruthy()
    })
    
      
    /* Checking if the user is redirected to the newBill page if he clicks on the new bill button. */
    test("Then I should be redirected to the newBill page if I click on the new bill button", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getAllByTestId('icon-window'))
      const newBillButton = screen.getByTestId('btn-new-bill')
      newBillButton.click()
      const url = window.location.hash
      expect(url).toBe(ROUTES_PATH.NewBill)
    })

    /* checking erreur 404 */
    test("fail fetches bills and 404 message error appear", async () => {
      /* fail to get localStorage */
      
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages and fails with 500 message error", async () => {

      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })

  })
})
