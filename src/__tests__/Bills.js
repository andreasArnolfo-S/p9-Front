/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import BillsUI from "../views/BillsUI.js";

import Bills from "../containers/Bills.js";

import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    test("Then bill icon in vertical layout should be highlighted", async () => {
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      // to-do write expect expression
      expect(windowIcon.classList).toContain("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    describe("When i click on NewBill button", () => {
      test("Then, i should navigate to NewBill page ", () => {
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const billsPage = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });
        const handleClickNewBill = jest.fn(billsPage.handleClickNewBill);
        const newBillButton = screen.getByTestId("btn-new-bill");

        console.log("newBillButton", newBillButton);

        newBillButton.addEventListener("click", handleClickNewBill);

        userEvent.click(newBillButton);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      });
    });

    describe("When I click on an icon eye", () => {
      test("handleClickIconEye should be called", () => {
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const billsPage = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });
        $.fn.modal = jest.fn();
        const handleClickIconEye = jest.fn(billsPage.handleClickIconEye);
        const eye = screen.getAllByTestId("icon-eye")[0];
        eye.addEventListener("click", function () {
          handleClickIconEye(eye);
        });
        userEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();

      });
    });

    /* Test de la route des factures. */
    test("fetches bills from mock API GET", async () => {
      /* Création d'un élément div dans le DOM. */
      const root = document.createElement("div");
      /* Création d'un élément div avec l'id de root. */
      root.setAttribute("id", "root");
      /* Ajout d'un élément div au corps du document. */
      document.body.append(root);
      /* Appel de la fonction routeur. */
      router();
      /* Fonction définie dans le fichier Router.js. */
      window.onNavigate(ROUTES_PATH.Bills);

      /* Espionnage de la fonction mockStore.bills. */
      const billsFetche = jest.spyOn(mockStore, "bills");
      /* En attente de l'appel de la fonction mockStore.bills(). */
      await waitFor(() => mockStore.bills());
      /* Vérifier si la fonction `mockStore.bills` a été appelée. */
      expect(billsFetche).toHaveBeenCalled();
    });
    test("fail fetches bills and 404 message error appear", async () => {
      /* Création d'un nouvel élément HTML avec le message d'erreur. */
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      /* Obtenir le message d'erreur du DOM. */
      const message = await screen.getByText(/Erreur 404/)
      /* Vérifier si le message est présent dans le DOM. */
      expect(message).toBeTruthy()
    })

    test("fetches messages and fails with 500 message error", async () => {
      /* Création d'un nouvel élément HTML avec le message d'erreur. */
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      /* Obtenir le message d'erreur du DOM. */
      const message = await screen.getByText(/Erreur 500/)
      /* Vérifier si le message est présent dans le DOM. */
      expect(message).toBeTruthy()
    })
  });
});
