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
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
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
      const antiChrono = (a, b) => (a < b ? 1 : +1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    describe("When i click on NewBill button", () => {
      test("Then, i should navigate to NewBill page ", () => {
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        // CHANGE VARIABLE NAME !!!
        const billsPage = new Bills({
          document,
          onNavigate,
          store,
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
      test("A modal should open", () => {
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const billsPage = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        $.fn.modal = jest.fn();
        const handleClickIconEye = jest.fn(billsPage.handleClickIconEye);
        const eye = screen.getAllByTestId("icon-eye")[0];
        eye.addEventListener("click", function () {
          handleClickIconEye(eye);
        });
        console.dir("eye", eye.parentElement.innerHTML);
        userEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();

        const modale = document.getElementById("modaleFile");
        expect(modale).toBeTruthy();
      });
    });

    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      const billsFetche = jest.spyOn(mockStore, "bills");
      await waitFor(() => mockStore.bills());
      expect(billsFetche).toHaveBeenCalled();
    });
  });
});
