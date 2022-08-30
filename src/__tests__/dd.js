/**
 * @jest-environment jsdom
 */

 import { screen, waitFor } from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 
 import router from "../app/Router.js";
 import userEvent from '@testing-library/user-event'
 import Bills from "../containers/Bills.js";
 import store from "../__mocks__/store.js";
 
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
 
     /* mock when i click on eye icon, then should open the modal */
     test("Then when i click on eye icon, then should open the modal", async () => {
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       const nBills = new Bills({
         document,
         onNavigate,
         store: null,
         localStorage: window.localStorage
       });
       /* moquer la fonction modale */
       $.fn.modal = jest.fn();
       /* Définition du corps du document sur la fonction BillsUI avec les données des factures. */
       document.body.innerHTML = BillsUI({ data: { bills } })
       /* Obtenir le premier élément avec l'identifiant de test `modalEye`. */
       const icon = screen.getAllByTestId('modalEye')[0];
       /* Création d'une fonction fictive. */
       const handleClickIconEye = jest.fn(() => nBills.handleClickIconEye(icon));
       /* Il ajoute un écouteur d'événement à l'icône. */
       icon.addEventListener('click', handleClickIconEye);
       /* Simulation d'un clic sur l'icône. */
       userEvent.click(icon);
       /* Vérifier si la fonction `handleClickIconEye` a été appelée. */
       expect(handleClickIconEye).toHaveBeenCalled();
       /* Obtenir l'élément modal du DOM. */
       const modal = document.getElementById('modaleFile');
       /* Vérifier si le modal est présent dans le DOM. */
       expect(modal).toBeTruthy();
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
 
     /* test ftech bills */
     test("fetches bills from mock", async () => {
       /* Espionner la fonction store.bills. */
       const getSpy = jest.spyOn(store, "bills")
       const bills = await store.bills()
       /* Obtenir la liste des factures du magasin. */
       const list = await bills.list()
       /* Obtenir l'élément tbody du DOM. */
       const tbody = screen.getByTestId("tbody")
       /* Définition du corps du document sur la fonction BillsUI avec les données de la liste. */
       document.body.innerHTML = BillsUI({ data: list })
       /* Vérifier si la fonction `store.bills` a été appelée une fois. */
       expect(getSpy).toHaveBeenCalledTimes(1)
       /* Vérifier si l'élément tbody est présent dans le DOM. */
       expect(tbody).toBeTruthy()
       /* Vérifier si le nombre de lignes dans la table est 4. */
       expect(document.querySelectorAll('tbody tr').length).toBe(4)
       expect(list.length).toBe(4)
     })
     test("fetches bills from mock API GET", async () => {
       localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByText("Mes notes de frais"))
       const check = screen.getByText("Mes notes de frais");
       expect(check).toBeTruthy();
     })
 
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
 
       const billsFetche = jest.spyOn(store, "bills");
       expect(billsFetche).toHaveBeenCalled();
     });
 
     /* checking erreur 404 */
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
   })
 })
 