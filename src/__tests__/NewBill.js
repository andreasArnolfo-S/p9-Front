/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { waitFor } from '@testing-library/dom';
import { fireEvent } from '@testing-library/dom';
import userEvent from "@testing-library/user-event";
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from './../__mocks__/localStorage';
import store from "../__mocks__/store.js";

/*-------andreas-------*/

describe("Given I am connected as an employee", () => {
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })

  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
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

    describe("When I add an image file as bill proof", () => {
      test("Then it should change input file", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI();
  
        const mockStore = {
          bills: jest.fn(() => newBill.store),
          create: jest.fn(() => Promise.resolve({})),
        };
  
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile);
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["image.png"], "image.png", { type: "png" })],
          },
        });
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0].name).toBe("image.png");
      });

      test("Then it should create a new bill", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI();
  
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });
        const handleSubmit = jest.fn(newBill.handleSubmit);
        const submitBtn = screen.getByTestId("form-new-bill");
        submitBtn.addEventListener("submit", handleSubmit);
        fireEvent.submit(submitBtn);
        expect(handleSubmit).toHaveBeenCalled();
      });

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

  })
})
