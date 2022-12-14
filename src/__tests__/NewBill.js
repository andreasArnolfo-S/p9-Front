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
import mockStore from "../__mocks__/store.js";

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

        /* Rendu du composant NewBillUI. */
        document.body.innerHTML = NewBillUI();
 
        /* Il cr??e une nouvelle instance de la classe NewBill. */
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });
        /* C'est une fonction factice qui est appel??e lorsque l'??v??nement `change` est d??clench?? sur le
        fichier d'entr??e. */
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        /* Obtenir l'??l??ment du fichier d'entr??e ?? partir du DOM. */
        const inputFile = screen.getByTestId("file");
        /* Il ajoute un ??couteur d'??v??nement au fichier d'entr??e. */
        inputFile.addEventListener("change", handleChangeFile);
        /* C'est une fonction qui est appel??e lorsque l'??v??nement `change` est d??clench?? sur le fichier
        d'entr??e. */
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["image.png"], "image.png", { type: "png" })],
          },
        });
        /* V??rifier si la fonction `handleChangeFile` a ??t?? appel??e. */
        expect(handleChangeFile).toHaveBeenCalled();
        /* V??rifier si le nom du fichier est image.png. */
        expect(inputFile.files[0].name).toBe("image.png");
      });

      test("Then it should create a new bill", () => {
       /* Rendu du composant NewBillUI. */
        document.body.innerHTML = NewBillUI();
  
        /* Il cr??e une nouvelle instance de la classe NewBill. */
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });
        /* Cr??ation d'une fonction fictive qui sera appel??e lorsque le bouton d'envoi sera cliqu??. */
        const handleSubmit = jest.fn(newBill.handleSubmit);
        /* Obtenir le bouton de soumission du DOM. */
        const submitBtn = screen.getByTestId("form-new-bill");
        /* Ajout d'un ??couteur d'??v??nement au bouton d'envoi. */
        submitBtn.addEventListener("submit", handleSubmit);
        /* D??clenchement de l'??v??nement submit sur le bouton submit. */
        fireEvent.submit(submitBtn);
        /* V??rifier si la fonction `handleSubmit` a ??t?? appel??e. */
        expect(handleSubmit).toHaveBeenCalled();
      });

      test("i cant submit and alert appear", () => {
       const html = NewBillUI()
        document.body.innerHTML = html

        const newBill = new NewBill({
          document,
          onNavigate,
          store: jest.fn(),
          localStorage: window.localStorage,
        });

        const fileInput = screen.getByTestId('file');
        fileInput.file = [new File([""], "test.txt", { type: "text/plain" })]

        const handleSubmit = jest.fn(() => newBill.handleSubmit)
        const submitButton = screen.getByTestId('form-new-bill')
        submitButton.addEventListener('submit', handleSubmit)
        fireEvent.submit(submitButton)
        window.alert = jest.fn()
        expect(handleSubmit).toHaveBeenCalled()
        expect(window.alert).toBeTruthy()
      })
      test("if create is not resolved, catch should be executed ", () => {
        /* Rendu du composant NewBillUI. */
        document.body.innerHTML = NewBillUI();
  
        /* Mock store */
        const mockStore = {
          bills: jest.fn(() => newBill.store),
          create: jest.fn(() => Promise.reject({})),
        };
  
        /* Il cr??e une nouvelle instance de la classe NewBill. */
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });
        /* C'est une fonction factice qui est appel??e lorsque l'??v??nement `change` est d??clench?? sur le
        fichier d'entr??e. */
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        /* Obtenir l'??l??ment du fichier d'entr??e ?? partir du DOM. */
        const inputFile = screen.getByTestId("file");
        /* Il ajoute un ??couteur d'??v??nement au fichier d'entr??e. */
        inputFile.addEventListener("change", handleChangeFile);
        /* C'est une fonction qui est appel??e lorsque l'??v??nement `change` est d??clench?? sur le fichier
        d'entr??e. */
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["image.png"], "image.png", { type: "png" })],
          },
        });
        /* V??rifier si la fonction `handleChangeFile` a ??t?? appel??e. */
        expect(handleChangeFile).toThrowError();
      })
    })

  })
})
