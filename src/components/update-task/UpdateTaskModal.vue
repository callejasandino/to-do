<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-10" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="bg-slate-500 text-center p-5 text-lg text-white rounded-md mb-5">Update Task</div>

                <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 mb-5">
                  <label for="name" class="block text-md font-medium text-gray-900 mb-3">Task Name</label>
                  <input type="text" name="name" class="block w-full border border-solid p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md sm:leading-6" v-model="taskInformation.title" />
                </div>

                <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 mb-5">
                  <label for="name" class="block text-md font-medium text-gray-900 mb-3">Task Description</label>
                  <textarea rows="5" name="comment" id="comment" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Add your comment..." v-model="taskInformation.description" />
                </div>

                <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 mb-5">
                  <label for="name" class="block text-md font-medium text-gray-900 mb-3">Due Date</label>
                  <input type="date" name="name" class="block w-full border-0 p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md sm:leading-6" v-model="taskInformation.due_date" />
                </div>

                <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 mb-5">
                  <label for="name" class="block text-md font-medium text-gray-900 mb-3">Priority</label>
                  <div v-for="priorityMethod in priorityMethods" :key="priorityMethod.id" class="flex items-center">
                    <input :id="priorityMethod.id" name="priority-method" type="radio" :value="priorityMethod.id" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" v-model="taskInformation.task_priority" />
                    <label :for="priorityMethod.id" class="ml-3 block text-sm font-medium leading-6 text-gray-900">
                      {{ priorityMethod.title }}
                    </label>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button type="button" class="inline-flex w-36 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 m-3" @click="closeModal">Cancel</button>

                  <button type="button" class="inline-flex w-36 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 m-3" @click="update">Update</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script src="./UpdateTaskModal.js"></script>
