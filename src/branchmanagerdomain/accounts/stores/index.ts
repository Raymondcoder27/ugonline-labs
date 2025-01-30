import type { Account, AccountResponse, IGoFilter, IErrorResponse, TillOperatorAccount, BackOfficeAccount, AllocateTillOperator, AssignTillOperator } from "@/types";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { useGoRequest } from "@/composables/go-request";
import { useNotificationsStore } from "@/stores/notifications";
import { useCommonsStore } from "../../../stores/commons";
import { AxiosError } from "axios";
import type { AccountResponseInterface, AccountsData, IResendVerificationPayload } from "@/branchmanagerdomain/accounts/types";
import type { Till } from "@/branchmanagerdomain/tills/types";
import { useTillStore } from "@/branchmanagerdomain/tills/stores";


export const useAccounts = defineStore("user-management", () => {

  const request = useGoRequest();
  const notify = useNotificationsStore();
  const commons = useCommonsStore();

  const tillStore = useTillStore();


  // Dummy Data for testing
  const dummyUserAccounts: Account[] = [
    {
      firstName: "John", lastName: "Doe", middleNames: "M", username: "john.doe@example.com",
      phone: "123-456-7890", role: "public", createdAt: "2021-01-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-01-01"
    },
    {
      firstName: "Jane", lastName: "Smith", middleNames: "A", username: "jane.smith@example.com",
      phone: "234-567-8901", role: "public", createdAt: "2021-02-01",
      emailVerified: true, phoneVerified: false, activatedAt: "2021-02-01"
    }
  ];

  // <th class="t-header" width="30%">Names</th>
  // <th class="t-header">Email</th>
  // <th class="t-header">Phone</th>
  // <!-- <th class="text-center">Role</th> -->
  // <th class="text-center">Status</th>
  // <!-- <th class="text-center">Activation</th> -->
  // <th class="text-center">Date</th>

  const dummyTillOperatorAccounts: TillOperatorAccount[] = [
    {
      firstName: "Grace", lastName: "Nakato", middleNames: "M", username: "Grace Nakato",
      phone: "123-456-7890", role: "manager", createdAt: "2021-01-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-01-01",
      email: "grace@gmail.com", status: "Active", till: "Till 1"
    },
    {
      firstName: "Moses", lastName: "Kato", middleNames: "A", username: "Moses Kato",
      phone: "234-567-8901", role: "manager", createdAt: "2021-02-01",
      emailVerified: true, phoneVerified: false, activatedAt: "2021-02-01",
      email: "kato@gmail.com", status: "Active", till: "Till 2"
    },
    {
      firstName: "Jim", lastName: "Kasana", middleNames: "B", username: "Jim Kasana",
      phone: "345-678-9012", role: "manager", createdAt: "2021-03-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01",
      email: "jim@gmail.com", status: "Active", till: "Till 3"
    }
  ];

  const dummyBackofficeAccounts: Account[] = [
    // {
    //   firstName: "Jack", lastName: "Tumwine", middleNames: "B", username: "jacktumwine.user@example.com",
    //   phone: "345-678-9012", role: "admin", createdAt: "2021-03-01",
    //   emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01", email: "admin.user@example.com"
    // },
    {
      id: "1", firstName: "Grace", lastName: "Nakato", username: "gracenakato@gmail.com",
      phone: "678-901-2345", role: "admin", createdAt: "2021-06-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-06-01", email: "gracenakato@gmail.com", middleName: "", middleNames:"", status: "", blockedAt: "", idType: "",
    },
    {
      id: "2", firstName: "Moses", lastName: "Kato", username: "katomoses@gmail.com",
      phone: "789-012-3456", role: "admin", createdAt: "2021-07-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-07-01", email: "katomoses@gmail.com", middleName: "", middleNames:"", status: "", blockedAt: "", idType: "",
    },
    {
      id: "3", firstName: "Jim", lastName: "Kasana", username: "jim@gmail.com",
      phone: "789-012-3456", role: "admin", createdAt: "2021-07-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-07-01", email: "jim@gmail.com", middleName: "", middleNames:"", status: "", blockedAt: "", idType: "",
    },
    {
      firstName: "Mable", lastName: "Lunkuse", middleNames: "B", username: "Mable Lunkuse",
      phone: "345-678-9012", role: "manager", createdAt: "2021-03-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01",
      email: "mable@gmail.com", status: "Active", till: "Till 3"
    }
  ];


  const response: Ref<AccountResponse | undefined> = ref();
  const userAccounts: Ref<Account[]> = ref([dummyUserAccounts]);
  const backofficeAccounts: Ref<Account[]> = ref([dummyBackofficeAccounts]);
  // const tillOperatorAccounts: Ref<TillOperatorAccount[]> = ref([dummyTillOperatorAccounts]);
  const tillOperators: Ref<TillOperatorAccount[]> = ref([dummyTillOperatorAccounts]);
  const tillOperatorAllocations: Ref<AllocateTillOperator[]> = ref([]);



  // allocate tillOperator to a Till using operatorId
  const allocateTillOperator = (payload: AllocateTillOperator) => {
    tillOperatorAllocations.value.push({
      id: tillOperatorAllocations.value.length + 1,
      dateAssigned: new Date().toISOString(),
      till: payload.tillId,
      manager: payload.operatorId,
      status: "Assigned"
    });

    // Update the manager's till
    const tillOperator = tillOperators.value.find((operator) => operator.id === payload.operatorId);
    if (operator) {
      operator.till = payload.tillId;
      // localStorageTillOperator.value = manager; // Update the local storage variable
      // }
    }

    // Update the till's manager
    const till = tills?.value.find((till) => till.id === payload.tillId);
    if (till) {
      till.operator = payload.operatorId;
    }

    // saveManagerToLocalStorage();
  }

  // const localStorageTillOperatorAccount = ref<TillOperator>();
  // const localStorageTillOperatorAccount = ref<TillOperatorAccount[]>([])

  // Save tillOperator to local storage
  // const saveManagerToLocalStorage = () => {
  //   // localStorage.setItem('branchManagerFloatBalance', JSON.stringify(localStorageTillOperator.value))
  //   localStorage.setItem('tillOperatorAccount', JSON.stringify(localStorageTillOperator.value))
  //   console.log("Manager saved to local storage:", localStorageTillOperator.value);

  // }
  // const saveManagerToLocalStorage = () => {
  //   if (localStorageTillOperator.value) {
  //     localStorage.setItem('tillOperatorAccount', JSON.stringify(localStorageTillOperator.value));
  //     console.log("Manager saved to local storage:", localStorageTillOperator.value);
  //   } else {
  //     console.warn("No tillOperator account to save to local storage.");
  //   }
  // };


  // Simulating account creation
  const createAccount = async (payload: any) => {
    return new Promise((resolve) => {
      resolve({ data: "Account created" });
    });
  }

  // const addtill = (newtill: till) => {
  //   tills.value.push(newtill); // Directly add the Till to the array
  // };



  // allocate float function, push to the float allocation array
  //  function allocateFloat(payload: AllocateFloat) {
  //   floatAllocations.value.push({
  //     id: floatAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     amount: payload.amount,
  //     status: "Assigned",
  //     till: payload.tillId,
  //   })
  // }

  // add tillOperator account, push to the tillOperator account array
  const addTillOperator = (newManager: TillOperator) => {
    tillOperators.value.push(
      {
        // id:  floatAllocations.value.length + 1,
        id: tillOperators.value.length + 1,
        firstName: newOperator.firstName,
        lastName: newOperator.lastName,
        middleNames: newOperator.middleNames,
        username: newOperator.username,
        phone: newOperator.phone,
        emailVerified: true,
        phoneVerified: true,
        role: newOperator.role,
        createdAt: new Date().toISOString(),
        status: "Active",
        email: newOperator.email,
        till: newOperator.tillId
      }
    );
  }



  // add backoffice account, push to the backoffice account array
  const addBackOfficeAccount = (newBackoffice: BackOfficeAccount) => {
    backofficeAccounts.value.push(
      {
        // id:  floatAllocations.value.length + 1,
        id: backofficeAccounts.value.length + 1,
        firstName: newBackoffice.firstName,
        lastName: newBackoffice.lastName,
        middleNames: newBackoffice.middleNames,
        username: newBackoffice.username,
        phone: newBackoffice.phone,
        emailVerified: true,
        phoneVerified: true,
        role: newBackoffice.role,
        createdAt: new Date().toISOString(),
        status: "Active",
        email: newBackoffice.email
      }
    ); // Directly add the backoffice to the array
  }

  // const addTillOperator = (newManager: TillOperator) => {
  //   tillOperatorAccounts.value.push(newManager); // Directly add the tillOperator to the array
  // }

  // Fetch dummy user accounts
  const fetchUserAccounts = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    userAccounts.value = dummyUserAccounts;
  }

  // Fetch dummy backoffice accounts
  const fetchBackofficeAccounts = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    backofficeAccounts.value = dummyBackofficeAccounts;
  }

  // Fetch dummy tillOperator accounts
  const fetchTillOperators = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    tillOperators.value = dummyTillOperatorAccounts;
  }

  // Simulating resend account verification
  const resendAccountVerification = async (payload: IResendVerificationPayload) => {
    return new Promise((resolve) => {
      if (payload.purpose === "email") {
        notify.success(`An account verification email has been sent to ${payload.username.toLowerCase()}`);
      } else if (payload.purpose === "phone") {
        notify.success(`An OTP has been sent to the phone number associated with ${payload.username.toLowerCase()}`);
      } else if (payload.purpose === "change-password") {
        notify.success(`A password reset email has been sent to ${payload.username.toLowerCase()}`);
      }
      resolve();
    });
  }

  // const assignManager = (payload: AssignManager) => {
  //   const tillToUpdate = tills.value?.find(till => till.id === payload.tillId);
  //   if (branchToUpdate) {
  //     tillToUpdate.operator = payload.operatorId;
  //   } else {
  //     console.warn(`Till with ID ${payload.tillId} not found.`);
  //   }
  // };

  // function submit() {
  //   let payload = {
  //     operatorId: form.operatorId,
  //     // tillId: form.tillId,
  //   };
  //   loading.value = true;
  //   tillStore.assignManager(payload); // Simply add the till
  //   notify.success("Manager assigned to till");
  //   emit("managerAssigned");
  //   loading.value = false;
  // }

  //use the tillOperator id to assign a tillOperator to a till
  // const assignManager = (payload: AssignManager) => {
  // const assignManager = (userId: string) => {
  //   const user = userAccounts.value?.find(userId => user.id === userId.userId);
  //   if (user) {
  //     tillOperatorAccounts.value.push({
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       phone: user.phone,
  //       role: user.role,
  //       status: user.status,
  //       createdAt: new Date().toISOString(),
  //       emailVerified: true,
  //       phoneVerified: true,
  //       activatedAt: new Date().toISOString(),
  //     });
  //   } else {
  //     console.warn(`Manager with ID ${payload.userId} not found.`);
  //     alert(`Manager with ID ${payload.userId} not found.`);
  //   }
  // };

  // assign tillOperator to a till
  // const assignManager = (userId: string) => {
  //   console.log('User ID:', userId); // Debugging log

  //   const user = backofficeAccounts.value?.find((account) => account.id === userId);  // Compare `userId` with `account.id`

  //   if (user) {
  //     tillOperatorAccounts.value.push({
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       phone: user.phone,
  //       role: user.role,
  //       status: user.status,
  //       createdAt: new Date().toISOString(),
  //       emailVerified: true,
  //       phoneVerified: true,
  //       activatedAt: new Date().toISOString(),
  //     });
  //   } else {
  //     console.warn(`User with ID ${userId} not found.`);
  //     alert(`User with ID ${userId} not found.`);
  //   }
  // };

  const assignOperator = (userId: string, tillId: string) => {
    console.log('User ID:', userId); // Debugging log
    console.log('Till ID:', tillId); // Debugging log

    const user = backofficeAccounts.value?.find((account) => account.id === userId); // Find user by `userId`

    const till = tillStore.tills?.find((till: Till) => till.id === tillId);

    // if (user && till) {
    if (user && till) {
      tillOperators.value.push({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: new Date().toISOString(),
        emailVerified: true,
        phoneVerified: true,
        activatedAt: new Date().toISOString(),
        till: till.name, // Include tillId
      });
      // tillOperatorAccounts.value.push(assignedManager);
      // localStorageTillOperator.value.push({
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   email: user.email,
      //   phone: user.phone,
      //   role: user.role,
      //   status: user.status,
      //   createdAt: new Date().toISOString(),
      //   emailVerified: true,
      //   phoneVerified: true,
      //   activatedAt: new Date().toISOString(),
      //   till: till.name, // Include tillId
      // }) // Update the local storage reference
      // saveManagerToLocalStorage(); // Save to local storage
      console.log(`Manager assigned to Till ${till.name}`);
      console.log(`Manager assigned to Till ${tillId}`);
    } else {
      console.warn(`User with ID ${userId} not found.`);
      alert(`User with ID ${userId} not found.`);
    }
  };






  // push new assigned tillOperator tillOperators array
  // const assignManager = (payload: AssignManager) => {
  //   tillOperatorAccounts.value.push({
  //     firstName: payload.firstName,
  //     lastName: payload.lastName,
  //     email: payload.email,
  //     phone: payload.phone,  
  //     role: payload.role,
  //     status: payload.status,
  //     createdAt: new Date().toISOString(),
  //     emailVerified: true,
  //     phoneVerified: true, 
  //     activatedAt: new Date().toISOString(),
  //   });
  // }



  return {
    response,
    userAccounts,
    backofficeAccounts,
    tillOperators,
    tillOperatorAllocations,
    assignOperator,
    createAccount,
    fetchBackofficeAccounts,
    fetchUserAccounts,
    fetchTillOperators,
    addTillOperator,
    addBackOfficeAccount,
    allocateTillOperator,
    resendAccountVerification
  };
});
