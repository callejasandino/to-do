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
                <div class="bg-slate-500 text-center p-5 text-lg text-white rounded-md mb-5">Add Tags</div>

                <div class="flex justify-between items-center content-center mb-5">
                  <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 flex-1">
                    <label for="name" class="block text-md font-medium text-gray-900 mb-3">Tag</label>
                    <input type="text" name="name" class="block w-full border border-solid p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md sm:leading-6" v-model="tagValue" />
                  </div>

                  <div>
                    <button type="button" class="inline-flex w-36 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 m-3" @click="addDiv">Add Tag</button>
                  </div>
                </div>

                <div v-if="divs" class="border border-solid rounded p-3 border-gray-800 h-96 w-full grid grid-cols-1 lg:grid-cols-3 xl:gap-x-8 overflow-y-auto">
                  <span v-for="(item, index) in divs" :key="index" class="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 m-3 h-10">
                    <svg class="h-1.5 w-1.5 fill-gray-400" viewBox="0 0 6 6" aria-hidden="true">
                      <circle cx="3" cy="3" r="3" />
                    </svg>
                    {{ item }}
                  </span>
                </div>

                <div class="flex justify-end">
                  <button type="button" class="inline-flex w-36 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 m-3" @click="closeModal">Cancel</button>

                  <button type="button" class="inline-flex w-36 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 m-3" @click="store">Save</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script src="./StoreTaskTagsModal.js"></script>

<style></style>
