<template>
  <b-card class="my-3">
    <b-card-header class="d-flex justify-content-between">
      <h3>Tickets</h3>
      <div class="d-flex justify-content-between">
        <!-- Begin:: Button Entry -->
        <div v-if="isTimeEntryForm">
          <b-button
            type="button"
            v-b-tooltip.hover
            :title="isEditFormTimeEntry ? 'Edit time entry' : 'Save time entry'"
            :variant="
              isEditFormTimeEntry ? 'outline-warning' : 'outline-primary'
            "
            @click="onSubmitTimeEntry"
            class="mx-1"
          >
            {{ isEditFormTimeEntry ? "Edit" : "Save" }}
          </b-button>
        </div>
        <!-- End:: Button Entry -->

        <div>
          <b-button
            type="button"
            variant="outline-success"
            v-b-tooltip.hover
            title="Criar um novo ticket"
            @click="$router.push('/create-ticket')"
            class="mx-1"
          >
            Criar Ticket
          </b-button>
        </div>
      </div>
    </b-card-header>

    <!-- Begin:: Time Entry Form -->
    <div v-if="isTimeEntryForm">
      <TimeEntryForm
        ref="TimeEntryForm"
        :ticket="ticketInformation"
        :isEditFormTimeEntry="isEditFormTimeEntry"
      />
    </div>
    <!-- End:: Time Entry Form -->

    <!-- Begin:: Tickets Table -->
    <TableListOfTickets
      @showTicketInformation="showTicketInformation"
      @showTimeEntryForm="showTimeEntryForm"
      class="my-2"
      @editTicket="editTicket"
      ref="TableListOfTickets"
      :tickets="tickets"
    />
    <!-- End:: Tickets Table -->

    <!-- Begin:: Modal Ticket Information -->
    <ModalTicketInformation
      @freshDataTimeEntryAndAssignedEmployee="
        freshDataTimeEntryAndAssignedEmployee
      "
      @editTimeEntry="editTimeEntry"
      :ticket="ticketInformation"
      ref="ModalTicketInformation"
    />
    <!-- End:: Modal Ticket Information -->
  </b-card>
</template>

<script>
import globalMixin from "@/core/mixins/global-mixin";
import moment from "moment";
import configMessage from "@/core/config/config-message-swall";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";

export default {
  methods: {
    goToNewTicket() {
      this.$router.push({ name: "create-ticket" }); // use o nome da rota do seu formulário
    },
  },
  name: "TicketPage", // multi-word name
  mixins: [validationMixin, globalMixin],
  components: {
    TableListOfTickets: () =>
      import("@/components/tables/table-list-of-tickets/TableListOfTickets"),
    // Multiselect: () => import("vue-multiselect"),//
    ModalTicketInformation: () =>
      import("@/components/modals/ModalTicketInformation"),
    TimeEntryForm: () => import("@/components/form/TimeEntryForm"),
  },
  created() {
    this.$store.dispatch("ticket/getListOfTickets");
    this.$store.dispatch("employee/getListOfEmployees");
    this.$store.dispatch("category/getListOfCategories");
    this.$store.dispatch("status/getListOfStatuses");
    this.$store.dispatch("priority/getListOfPriorities");
    this.$store.dispatch("kind/getListOfKinds");
  },
  computed: {
    ...mapState("category", {
      categories: (state) =>
        state.categories.map((item) => ({ value: item.id, text: item.name })),
    }),
    ...mapState("status", {
      statuses: (state) =>
        state.statues.map((item) => ({ value: item.id, text: item.name })),
    }),
    ...mapState("priority", {
      priorities: (state) =>
        state.priorities.map((item) => ({ value: item.id, text: item.name })),
    }),
    ...mapState("kind", {
      kinds: (state) =>
        state.kinds.map((item) => ({ value: item.id, text: item.name })),
    }),
    ...mapState("ticket", {
      tickets: (state) => state.tickets,
    }),
    ...mapState("employee", {
      employees: (state) =>
        state.employees.map((item) => ({
          id: item.id,
          name: `${item.first_name} ${item.last_name}`,
        })),
    }),
  },
  validations() {
    return {
      form: {
        date: { required },
        title: { required },
        employees: { required },
        selectedCategories: { required },
        selectedStatus: { required },
        selectedPriorities: { required },
        selectedKind: { required },
      },
    };
  },
  data() {
    return {
      isEditForm: false,
      isAdd: false, // remove opção de criar ticket
      ticketInformation: {},
      isTimeEntryForm: false,
      isEditFormTimeEntry: false,
      form: {
        date: "",
        title: "",
        description: "",
        employees: [],
        selectedCategories: "",
        selectedStatus: "",
        selectedPriorities: "",
        selectedKind: "",
      },
    };
  },
  methods: {
    validateState({ name }) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    onReset() {
      this.$nextTick(() => this.$v.$reset());
      this.form = {
        date: "",
        title: "",
        description: "",
        employees: [],
        selectedCategories: "",
        selectedStatus: "",
        selectedPriorities: "",
        selectedKind: "",
      };
      this.isAdd = false;
      this.isEditForm = false;
      this.$refs.TableListOfTickets.refreshData();
      if (this.isTimeEntryForm || this.isEditFormTimeEntry) {
        this.$refs.TimeEntryForm.onReset();
        this.isTimeEntryForm = false;
        this.isEditFormTimeEntry = false;
      }
    },
    onCancel() {
      this.$swal(configMessage.confirm_cancel).then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.onReset();
          this.$swal(configMessage.success);
        }
      });
    },
    async showTicketInformation({ item }) {
      try {
        this.ticketInformation = {};
        const { id } = item;
        this.ticketInformation = await this.getAssignedTicketsEmployees({ id });
        this.ticketInformation.entries = await this.getTicketTimeEntry({ id });
        this.$refs.ModalTicketInformation.modalHandler();
      } catch (e) {
        await this.$swal(configMessage.error);
      }
    },
    async showTimeEntryForm({ item }) {
      try {
        this.ticketInformation = {};
        const { id } = item;
        this.ticketInformation = await this.getAssignedTicketsEmployees({ id });
        this.ticketInformation.employees = this.ticketInformation.employees.map(
          (item) => ({
            id: item.id,
            name: `${item.first_name} ${item.last_name}`,
          })
        );
        if (!this.isEditFormTimeEntry) {
          this.isTimeEntryForm = true;
        }
      } catch (e) {}
    },
    async getAssignedTicketsEmployees({ id }) {
      try {
        const { data } = await this.$store.dispatch(
          "ticket/getAssignedTicketsEmployees",
          id
        );
        return data;
      } catch (e) {}
    },
    async getTicketTimeEntry({ id }) {
      try {
        const { data } = await this.$store.dispatch("ticket/getATicket", id);
        return data.entries;
      } catch (e) {}
    },
    async editTicket(ticket) {
      await this.$swal(configMessage.confirm_edit).then(async () => {
        const { item } = ticket;
        const { id } = item;
        this.isEditForm = true;
        try {
          const { data } = await this.$store.dispatch(
            "ticket/getAssignedTicketsEmployees",
            id
          );
          this.$nextTick(() => {
            this.form.id = data.id;
            this.form.date = moment(data.date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            );
            this.form.title = data.title;
            this.form.description = data.description;
            this.form.employees = data.employees.map((item) => ({
              id: item.id,
              name: `${item.first_name} ${item.last_name}`,
            }));
            this.form.selectedCategories = data.category.id;
            this.form.selectedStatus = data.status.id;
            this.form.selectedPriorities = data.priority.id;
            this.form.selectedKind = data.kind.id;
          });
        } catch (e) {
          await this.$swal(configMessage.error);
        }
      });
    },
    freshDataTimeEntryAndAssignedEmployee() {
      this.showTicketInformation({ item: this.ticketInformation });
    },
    editTimeEntry(id) {
      this.isEditFormTimeEntry = true;
      this.isTimeEntryForm = true;
      this.showTimeEntryForm({ item: { id } });
    },
    onSubmitTimeEntry() {
      try {
        this.$refs.TimeEntryForm.onSubmit();
        this.isTimeEntryForm = false;
        this.isEditFormTimeEntry = false;
      } catch (e) {
        this.$swal(configMessage.error);
      }
    },
  },
};
</script>

<style scoped></style>
