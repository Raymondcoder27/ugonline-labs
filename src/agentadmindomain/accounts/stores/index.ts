import type { Account, AccountResponse, IGoFilter, IErrorResponse, ManagerAccount, BackOfficeAccount, AllocateManager, AssignManager } from "@/types";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { useGoRequest } from "@/composables/go-request";
import { useNotificationsStore } from "@/stores/notifications";
import { useCommonsStore } from "../../../stores/commons";
import { AxiosError } from "axios";
import type { AccountResponseInterface, AccountsData, IResendVerificationPayload } from "@/agentadmindomain/accounts/types";
import type { Branch } from "@/agentadmindomain/branches/types";
import { useBranchStore } from "@/agentadmindomain/branches/stores";
import api from "@/config/api";


export const useAccounts = defineStore("user-management", () => {

  const request = useGoRequest();
  const notify = useNotificationsStore();
  const commons = useCommonsStore();

  const branchStore = useBranchStore();

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

  const dummyManagerAccounts: ManagerAccount[] = [
    {
      firstName: "Kalungu", lastName: "Kevin", middleNames: "M", username: "James Doe",
      phone: "123-456-7890", role: "manager", createdAt: "2021-01-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-01-01",
      email: "kevinkalungu@gmail.com", status: "Active", branch: "Branch 1"
    },
    {
      firstName: "Mukisa", lastName: "Crispus", middleNames: "A", username: "Jane Smith",
      phone: "234-567-8901", role: "manager", createdAt: "2021-02-01",
      emailVerified: true, phoneVerified: false, activatedAt: "2021-02-01",
      email: "crispusmukisa@gmail.com", status: "Active", branch: "Branch 2"
    },
    {
      firstName: "Katamba", lastName: "Bradely", middleNames: "B", username: "John Doe",
      phone: "345-678-9012", role: "manager", createdAt: "2021-03-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01",
      email: "bradelykata@gmail.com", status: "Active", branch: "Branch 3"
    }
  ];

  const dummyBackofficeAccounts: Account[] = [
    // {
    //   firstName: "Jack", lastName: "Tumwine", middleNames: "B", username: "jacktumwine.user@example.com",
    //   phone: "345-678-9012", role: "admin", createdAt: "2021-03-01",
    //   emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01", email: "admin.user@example.com"
    // },
    {
      id: "1", firstName: "Jack", lastName: "Tumwine", username: "jacktumwine.user@example.com",
      phone: "345-678-9012", role: "admin", createdAt: "2021-03-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01", email: "jacktumwine.user@example.com"
    },
    {
      id: "2", firstName: "Sarah", lastName: "Nambasa", username: "sarahnambasa.agent@example.com",
      phone: "456-789-0123", role: "admin", createdAt: "2021-04-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-04-01", email: "sarahnambasa.agent@example.com"
    },
    {
      id: "3", firstName: "Joseph", lastName: "Mugisha", username: "josephmugisha@gmail.com",
      phone: "567-890-1234", role: "admin", createdAt: "2021-05-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-05-01", email: "josephmugisha@gmail.com",
    },
    {
      id: "4", firstName: "Grace", lastName: "Nakato", username: "gracenakato@gmail.com",
      phone: "678-901-2345", role: "admin", createdAt: "2021-06-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-06-01", email: "gracenakato@gmail.com",
    },
    {
      id: "5", firstName: "Moses", lastName: "Kato", username: "katomoses@gmail.com",
      phone: "789-012-3456", role: "admin", createdAt: "2021-07-01",
      emailVerified: true, phoneVerified: true, activatedAt: "2021-07-01", email: "katomoses@gmail.com",
    },
  ];


  const response: Ref<AccountResponse | undefined> = ref();
  const userAccounts: Ref<Account[]> = ref([dummyUserAccounts]);
  // const backofficeAccounts: Ref<Account[]> = ref([dummyBackofficeAccounts]);
  const backofficeAccounts: Ref<Account[]> = ref();

  const managerAccounts: Ref<ManagerAccount[]> = ref([dummyManagerAccounts]);
  const managerAllocations: Ref<AllocateManager[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);



  // allocate manager to a branch using managerId
  const allocateManager = (payload: AllocateManager) => {
    managerAllocations.value.push({
      id: managerAllocations.value.length + 1,
      dateAssigned: new Date().toISOString(),
      branch: payload.branchId,
      manager: payload.managerId,
      status: "Assigned"
    });

    // Update the manager's branch
    const manager = managerAccounts.value.find((manager) => manager.id === payload.managerId);
    if (manager) {
      manager.branch = payload.branchId;
      localStorageManagerAccount.value = manager; // Update the local storage variable
      // }
    }

    // Update the branch's manager
    const branch = branches?.value.find((branch) => branch.id === payload.branchId);
    if (branch) {
      branch.manager = payload.managerId;
    }

    saveManagerToLocalStorage();
  }

  // const localStorageManagerAccount = ref<ManagerAccount>();
  const localStorageManagerAccount = ref<ManagerAccount[]>([])

  // Save manager to local storage
  // const saveManagerToLocalStorage = () => {
  //   // localStorage.setItem('branchManagerFloatBalance', JSON.stringify(localStorageManagerAccount.value))
  //   localStorage.setItem('branchManagerAccount', JSON.stringify(localStorageManagerAccount.value))
  //   console.log("Manager saved to local storage:", localStorageManagerAccount.value);

  // }
  const saveManagerToLocalStorage = () => {
    if (localStorageManagerAccount.value) {
      localStorage.setItem('branchManagerAccount', JSON.stringify(localStorageManagerAccount.value));
      console.log("Manager saved to local storage:", localStorageManagerAccount.value);
    } else {
      console.warn("No manager account to save to local storage.");
    }
  };


  // Simulating account creation
  const createAccount = async (payload: any) => {
    return new Promise((resolve) => {
      resolve({ data: "Account created" });
    });
  }

  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch); // Directly add the branch to the array
  // };



  // allocate float function, push to the float allocation array
  //  function allocateFloat(payload: AllocateFloat) {
  //   floatAllocations.value.push({
  //     id: floatAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     amount: payload.amount,
  //     status: "Assigned",
  //     branch: payload.branchId,
  //   })
  // }

  // add manager account, push to the manager account array
  const addManagerAccount = (newManager: ManagerAccount) => {
    managerAccounts.value.push(
      {
        // id:  floatAllocations.value.length + 1,
        id: managerAccounts.value.length + 1,
        firstName: newManager.firstName,
        lastName: newManager.lastName,
        middleNames: newManager.middleNames,
        username: newManager.username,
        phone: newManager.phone,
        emailVerified: true,
        phoneVerified: true,
        role: newManager.role,
        createdAt: new Date().toISOString(),
        status: "Active",
        email: newManager.email,
        branch: newManager.branchId
      }
    );
  }



  // add backoffice account, push to the backoffice account array
  // const addBackOfficeAccount = (newBackoffice: BackOfficeAccount) => {
  //   backofficeAccounts.value.push(
  //     {
  //       // id:  floatAllocations.value.length + 1,
  //       id: backofficeAccounts.value.length + 1,
  //       firstName: newBackoffice.firstName,
  //       lastName: newBackoffice.lastName,
  //       middleNames: newBackoffice.middleNames,
  //       username: newBackoffice.username,
  //       phone: newBackoffice.phone,
  //       emailVerified: true,
  //       phoneVerified: true,
  //       role: newBackoffice.role,
  //       createdAt: new Date().toISOString(),
  //       status: "Active",
  //       email: newBackoffice.email
  //     }
  //   ); // Directly add the backoffice to the array
  // }

  async function addBackOfficeAccount(newBackoffice: BackOfficeAccount) {
    try {
      const { data } = await api.post("/backoffice", {
        firstName: newBackoffice.firstName,
        lastName: newBackoffice.lastName,
        email: newBackoffice.email,
        phone: newBackoffice.phone,
        role: newBackoffice.role,
        status: newBackoffice.status,
        createdAt: new Date().toISOString(),
        emailVerified: true,
        phoneVerified: true,
        activatedAt: new Date().toISOString(),
      });
      backofficeAccounts.value?.push(data.data);
    } catch (error) {
      console.error("Error adding backoffice account:", error);
    }
  }

  // const { data} = await api.post("/branch-manager", {
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
  //   branch: branch.name, // Include branchId
  // });

  // const addManagerAccount = (newManager: ManagerAccount) => {
  //   managerAccounts.value.push(newManager); // Directly add the manager to the array
  // }

  // Fetch dummy user accounts
  const fetchUserAccounts = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    userAccounts.value = dummyUserAccounts;
  }

  // Fetch dummy backoffice accounts
  // const fetchBackofficeAccounts = async (filter: IGoFilter) => {
  //   // Here you would normally process the filter if you had real data
  //   backofficeAccounts.value = dummyBackofficeAccounts;
  // }

  // const fetchBackofficeAccounts = async (filter: IGoFilter) => {
  //   // Here you would normally process the filter if you had real data
  //   backofficeAccounts.value = api.post("/backoffice-accounts", filter);
  // }

  async function fetchBackofficeAccounts() {
    isLoading.value = true;
    try {
      const { data } = await api.get("/backoffices");
      backofficeAccounts.value = data.data;
    } catch (error) {
      console.error("Error fetching backoffice accounts:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch dummy manager accounts
  // const fetchManagerAccounts = async (filter: IGoFilter) => {
  //   // Here you would normally process the filter if you had real data
  //   managerAccounts.value = dummyManagerAccounts;
  // }

  async function fetchManagerAccounts() {
    isLoading.value = true;
    try {
      const { data } = await api.get("/branch-managers");
      managerAccounts.value = data.data;
    } catch (error) {
      console.error("Error fetching manager accounts:", error);
    } finally {
      isLoading.value = false;
    }
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
  //   const branchToUpdate = branches.value?.find(branch => branch.id === payload.branchId);
  //   if (branchToUpdate) {
  //     branchToUpdate.manager = payload.managerId;
  //   } else {
  //     console.warn(`Branch with ID ${payload.branchId} not found.`);
  //   }
  // };

  // function submit() {
  //   let payload = {
  //     managerId: form.managerId,
  //     // branchId: form.branchId,
  //   };
  //   loading.value = true;
  //   branchStore.assignManager(payload); // Simply add the branch
  //   notify.success("Manager assigned to branch");
  //   emit("managerAssigned");
  //   loading.value = false;
  // }

  //use the manager id to assign a manager to a branch
  // const assignManager = (payload: AssignManager) => {
  // const assignManager = (userId: string) => {
  //   const user = userAccounts.value?.find(userId => user.id === userId.userId);
  //   if (user) {
  //     managerAccounts.value.push({
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

  // assign manager to a branch
  // const assignManager = (userId: string) => {
  //   console.log('User ID:', userId); // Debugging log

  async function assignManager(userId: string, branchId: string) {
    console.log('User ID:', userId); // Debugging log
    console.log('Branch ID:', branchId); // Debugging log

    const user = backofficeAccounts.value?.find((account) => account.id === userId); // Find user by `userId`

    const branch = branchStore.branches?.find((branch: Branch) => branch.id === branchId);

    // if (user && branch) {
    if (user && branch) {
      // managerAccounts.value.push({
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
      //   branch: branch.name, // Include branchId
      // });

      const { data } = await api.post("/branch-manager", {
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
        branch: branch.name, // Include branchId
      });

      managerAccounts.value?.push(data.data);


      // managerAccounts.value.push(assignedManager);
      // localStorageManagerAccount.value.push({
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
      //   branch: branch.name, // Include branchId
      // }) // Update the local storage reference
      // saveManagerToLocalStorage(); // Save to local storage
      console.log(`Manager assigned to branch ${branch.name}`);
      console.log(`Manager assigned to branch ${branchId}`);
    } else {
      console.warn(`User with ID ${userId} not found.`);
      alert(`User with ID ${userId} not found.`);
    }
  };






  // push new assigned manager managerAccounts array
  // const assignManager = (payload: AssignManager) => {
  //   managerAccounts.value.push({
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
    managerAccounts,
    managerAllocations,
    assignManager,
    createAccount,
    fetchBackofficeAccounts,
    fetchUserAccounts,
    fetchManagerAccounts,
    addManagerAccount,
    addBackOfficeAccount,
    allocateManager,
    resendAccountVerification
  };
});
