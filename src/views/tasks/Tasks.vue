<template>
  <div class="mt-5 w-28 ml-auto">
    <button type="submit" @click="logout" class="mt-5 flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Logout</button>
    <button type="submit" @click="toggleCreateTask" class="mt-5 flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Create Task</button>
  </div>
  <div class="mx-auto bg-slate-600 text-white p-5 mt-5 text-center">
    <label>Tasks</label>
  </div>
  <div class="container mt-5">
    <div class="flex flex-wrap md:flex-nowrap justify-between content-center items-center mb-5">
      <div class="flex flex-wrap justify-between content-center items-center border p-5 mb-4 md:mb-0 md:flex-nowrap">
        <div class="mr-5">
          <label class="block text-sm font-medium leading-6 text-gray-900">Sort By:</label>
          <select v-model="sortBy" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="title">Title</option>
            <option value="description">Description</option>
            <option value="due_date">Due Date</option>
            <option value="task_priority">Priority</option>
            <option value="date_completed">Date Completed</option>
            <option value="created_at">Created At</option>
          </select>
        </div>

        <div class="mr-5">
          <label class="block text-sm font-medium leading-6 text-gray-900">Order By:</label>
          <select v-model="orderBy" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div class="flex">
          <button type="button" @click.prevent="resetArrangement" class="m-2 inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <XCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Reset
          </button>

          <button type="button" @click.prevent="sort" class="m-2 inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <CheckCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Sort
          </button>
        </div>
      </div>

      <!-- Filter -->
      <div class="flex flex-wrap justify-evenly content-center items-center p-5 border flex-1 md:flex-nowrap">
        <div class="mr-5 w-full">
          <label class="block text-sm font-medium leading-6 text-gray-900">Filter By:</label>
          <select v-model="filterBy" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="date_completed">Completed Date</option>
            <option value="priority">Task Priority</option>
            <option value="due_date">Due Date</option>
            <option value="archived_date">Archived Date</option>
            <option value="search">Search</option>
          </select>
        </div>

        <div v-if="filterBy == 'date_completed' || filterBy == 'due_date' || filterBy == 'archived_date'" class="mr-5 flex w-full">
          <div class="mr-5">
            <label class="block text-sm font-medium leading-6 text-gray-900">From:</label>
            <input type="date" v-model="fromDate" />
          </div>

          <div class="mr-5">
            <label class="block text-sm font-medium leading-6 text-gray-900">To:</label>
            <input type="date" v-model="toDate" />
          </div>
        </div>

        <div v-else-if="filterBy == 'priority'" class="mr-5 w-full">
          <label class="block text-sm font-medium leading-6 text-gray-900">Priority:</label>
          <select v-model="taskPriority" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>

        <div v-else>
          <label class="block text-sm font-medium leading-6 text-gray-900">Search:</label>
          <input type="text" name="name" class="block w-full border border-solid p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md sm:leading-6" v-model="search" />
        </div>

        <div class="flex">
          <button type="button" @click.prevent="resetArrangement" class="m-2 inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <XCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Reset
          </button>

          <button type="button" @click.prevent="filter" class="m-2 inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <CheckCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Filter
          </button>
        </div>
      </div>
    </div>

    <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      <li v-for="task in tasks" :key="task.id" class="overflow-hidden rounded-xl border border-gray-200">
        <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <div class="flex flex-col">
            <div class="text-sm font-medium leading-6 text-gray-900">
              Title:
              {{ task.title }}
            </div>
            <div class="text-sm font-medium leading-6 text-gray-900">
              Owner:
              {{ task.user.name }}
            </div>
          </div>

          <Menu as="div" class="relative ml-auto">
            <MenuButton class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">Open options</span>
              <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-0.5 w-44 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem as="button">
                  <div>
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="toggleCreateTaskTag(task.id, task.tag)">Add Tags</button>
                  </div>
                </MenuItem>

                <MenuItem as="button">
                  <div>
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="toggleTaskAttachment(task.id)">Add Attachments</button>
                  </div>
                </MenuItem>

                <MenuItem as="button">
                  <div v-if="!task.date_completed">
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="toggleUpdateTask(task)">Update</button>
                  </div>
                </MenuItem>

                <MenuItem as="button">
                  <div v-if="!task.date_completed">
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="markTask(task.id, true)">Mark as Complete</button>
                  </div>
                  <div v-else>
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="markTask(task.id, false)">Mark as Incomplete</button>
                  </div>
                </MenuItem>

                <MenuItem as="button">
                  <div v-if="task.is_archived">
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="archiveTask(task.id, false)">Mark as Unarchived</button>
                  </div>
                  <div v-else>
                    <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="archiveTask(task.id, true)">Mark as Archive</button>
                  </div>
                </MenuItem>

                <MenuItem as="button">
                  <button type="button" class="block px-3 py-1 text-sm leading-6 text-gray-900" @click.prevent="deleteTask(task.id)">Deleted</button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div v-if="task.task_attachments.length !== 0" class="flex flex-col justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Attachments:</dt>
            <Carousel :attachments="task.task_attachments" />
          </div>

          <div v-if="task.date_completed != null" class="flex justify-between gap-x-4 py-3 content-center items-center">
            <dt class="text-gray-500">
              <span class="inline-flex items-center gap-x-2.5 rounded-md bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-700">
                <svg class="h-2.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                  <circle cx="3" cy="3" r="3" />
                </svg>

                Status: Completed
              </span>
            </dt>
            <dd class="text-gray-700">
              <div>
                {{ task.date_completed }}
              </div>
            </dd>
          </div>

          <div v-if="task.is_archived" class="flex justify-between gap-x-4 py-3 content-center items-center">
            <dt class="text-gray-500">
              <span class="inline-flex items-center gap-x-2.5 rounded-md bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-700">
                <svg class="h-2.5 w-1.5 fill-amber-500" viewBox="0 0 6 6" aria-hidden="true">
                  <circle cx="3" cy="3" r="3" />
                </svg>

                Status: Archived
              </span>
            </dt>
            <dd class="text-gray-700">
              <div>
                {{ task.archived_date }}
              </div>
            </dd>
          </div>

          <div class="flex flex-col justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Description:</dt>
            <dd class="text-gray-700">
              <div>
                {{ task.description }}
              </div>
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Due Date</dt>
            <dd class="text-gray-700">
              <div>
                {{ task.due_date ?? 'None' }}
              </div>
            </dd>
          </div>

          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Priority</dt>
            <dd class="text-gray-700">
              <div v-if="task.task_priority == 'Urgent'">
                <span class="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                  <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
                    <circle cx="3" cy="3" r="3" />
                  </svg>
                  {{ task.task_priority }}
                </span>
              </div>

              <div v-else-if="task.task_priority == 'High'">
                <span class="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
                  <svg class="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                    <circle cx="3" cy="3" r="3" />
                  </svg>
                  {{ task.task_priority }}
                </span>
              </div>

              <div v-else-if="task.task_priority == 'Normal'">
                <span class="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                  <svg class="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                    <circle cx="3" cy="3" r="3" />
                  </svg>
                  {{ task.task_priority }}
                </span>
              </div>

              <div v-else-if="task.task_priority == 'Low'">
                <span class="inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                  <svg class="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
                    <circle cx="3" cy="3" r="3" />
                  </svg>
                  {{ task.task_priority }}
                </span>
              </div>

              <div v-else>
                <span class="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                  <svg class="h-1.5 w-1.5 fill-gray-500" viewBox="0 0 6 6" aria-hidden="true">
                    <circle cx="3" cy="3" r="3" />
                  </svg>
                  None
                </span>
              </div>
            </dd>
          </div>

          <div v-if="task.tag">
            <div class="flex justify-between gap-x-4 py-3">
              <dt class="text-gray-500">Tags</dt>
            </div>

            <span v-for="(tag, index) in parseTags(task.tag.tags)" :key="index" class="inline-flex items-center gap-x-1.5 rounded-md bg-violet-600 px-2 py-1 text-xs font-medium text-white m-3 h-7">
              <svg class="h-1.5 w-1.5 fill-violet-400" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx="3" cy="3" r="3" />
              </svg>
              {{ tag }}
            </span>
          </div>
        </dl>
      </li>
    </ul>

    <div v-if="noOfPages" class="my-5 text-slate-800 w-full py-5">
      <nav class="flex items-center justify-between border-t border-gray-200 p-4 m-4">
        <div class="-mt-px flex w-0 flex-1">
          <button :disabled="currentPage === 1" href="#" class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium hover:border-gray-300 hover:text-gray-700" @click="goToPrevPage">
            <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Previous
          </button>
        </div>

        <div class="hidden md:-mt-px md:flex">
          <button
            v-for="page in noOfPages"
            :key="page"
            @click="goToPage(page)"
            :class="{
              'border-indigo-500 text-indigo-600': currentPage === page,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': currentPage !== page
            }"
            class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium"
          >
            {{ page }}
          </button>
        </div>

        <div class="-mt-px flex w-0 flex-1 justify-end">
          <button :disabled="currentPage === noOfPages" href="#" class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium hover:border-gray-300 hover:text-gray-700" @click="goToNextPage">
            Next
            <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>

    <!-- Modals -->
    <StoreTaskModal :isCreateTaskModalOpen="isCreateTaskModalOpen" @close="toggleCreateTask" />

    <div v-if="taskToUpdate">
      <UpdateTaskModal :isUpdateTaskModalOpen="isUpdateTaskModalOpen" :task="taskToUpdate" @close="toggleUpdateTask" />
    </div>

    <div v-if="taskId && isTaskTagsModalOpen">
      <StoreTaskTagsModal :isTaskTagsModalOpen="isTaskTagsModalOpen" :taskId="taskId" :currentTags="tags" @close="toggleCreateTaskTag" />
    </div>

    <div v-if="taskId && isStoreTaskAttachmentModalOpen">
      <StoreTaskAttachmentModal :isStoreTaskAttachmentModalOpen="isStoreTaskAttachmentModalOpen" :taskId="taskId" @close="toggleTaskAttachment" />
    </div>
  </div>
</template>

<script src="./Tasks.js"></script>

<style lang="scss" scoped></style>
