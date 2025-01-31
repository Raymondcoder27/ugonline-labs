import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Branch } from "@/agentadmindomain/branches/types"; // Assuming you have a Branch type
import type { AssignManager } from "@/types";

export const useBranchStore = defineStore("useBranch", () => {

  // Dummy data for testing purposes
  const dummyBranches: Branch[] = [
    { id: 1, name: "Branch 1", location: "Location 1", manager: "", status: "Active" },
    { id: 2, name: "Branch 2", location: "Location 2", manager: "", status: "Inactive" },
    { id: 3, name: "Branch 3", location: "Location 3", manager: "", status: "Active" },
    { id: 4, name: "Branch 4", location: "Location 4", manager: "", status: "Inactive" },
    { id: 5, name: "Branch 5", location: "Location 5", manager: "", status: "Active" },
    { id: 6, name: "Branch 6", location: "Location 6", manager: "", status: "Inactive" },
    { id: 7, name: "Branch 7", location: "Location 7", manager: "", status: "Active" },
    { id: 8, name: "Branch 8", location: "Location 8", manager: "", status: "Inactive" },
    { id: 9, name: "Branch 9", location: "Location 9", manager: "", status: "Active" },
    { id: 10, name: "Branch 10", location: "Location 10", manager: "", status: "Inactive" },
    { id: 11, name: "Branch 11", location: "Location 11", manager: "", status: "Active" },
  ];

  // Add new branch to the store
  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch);
  // };

  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch); // Directly add the branch to the array
  // };

  // const allocateManager = (payload: AllocateManager) => {
  //   managerAllocations.value.push({
  //     id: managerAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     branch: payload.branchId,
  //     manager: payload.managerId,
  //     status: "Assigned"
  //   });

  // state variables
  const branches: Ref<Branch[] | undefined> = ref(dummyBranches);
  const branch: Ref<Branch | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);
  const managerAssignments: Ref<AssignManager[]> = ref([]);

  const addBranch = (newBranch: Branch) => {
    branches.value?.push({
      id: branches.value?.length + 1,
      name: newBranch.name,
      location: newBranch.location,
      status: newBranch.status,
    })
  }

  // const allocateManager = (payload: AllocateManager) => {
  //   const branchToUpdate = branches.value?.find(branch => branch.id === payload.branchId);
  //   if (branchToUpdate) {
  //     branchToUpdate.manager = payload.managerId;
  //   } else {
  //     console.warn(`Branch with ID ${payload.branchId} not found.`);
  //   }
  // };

  const assignManager = (payload: AssignManager) => {
    const branchToUpdate = branches.value?.find(branch => branch.id === payload.branchId);
    if (branchToUpdate) {
      branchToUpdate.manager = payload.managerId;
    } else {
      console.warn(`Branch with ID ${payload.branchId} not found.`);
    }
  };
  
  // push new assigned manager managerAccounts array
  // const assignManager = (payload: AssignManager) => {
  //   managerAssignments.value.push({
  //     branchId: payload.branchId,
  //     managerId: payload.managerId,
  //   });
  // }

  //update managerAccounts array with this new manager
  // const assignManager = (payload: AssignManager) => {
  //   managerAccounts


   // Delete branch from the store
  //  const deleteBranch = (branchId: string) => {
  //   branches.value = branches.value?.filter((branch) => branch.id !== branchId); // Remove the branch by ID
  // };


  const deleteBranch = (branchId: string) => {
    branches.value = branches.value?.filter((b) => b.id !== branchId); 
  }

  // const service = subscribedServices.value?.find((s) => s.id === serviceId);
  // if (service) {
  //   service.status = "listed";
  //   services.value?.push(service);
  //   subscribedServices.value = subscribedServices.value?.filter((s) => s.id !== serviceId);
  // }

  
  
  
  

  // async function fetchBranches(filter: any) {
  //   // isLoading.value = true;
  //   // try {
  //     // Uncomment the following line to fetch data from the API once ready
  //     // const { data } = await api.get(`/branches?page=${page}&limit=${limit}`);
      
  //     // For now, use the dummy data for testing
  //     // branches.value = dummyBranches; // Use dummy data for testing

  //     // Uncomment below to assign the API data when it's available
  //     // branches.value = data;
  //   // } catch (error) {
  //     // console.error(error);
  //     // throw error;
  //   // } finally {
  //     // isLoading.value = false;
  //   // }
  // }

  async function fetchBranches() {
    isLoading.value = true;
    try {
      const { data } = await api.get("/branch");
      branches.value = data.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    branches,
    branch,
    managerAssignments,
    fetchBranches,
    assignManager,
    addBranch,
    deleteBranch,
  };
});
