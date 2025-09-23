<template>
  <div>
    <fieldset class="m-1 border-dark">
      <legend>Criar Novo Ticket</legend>

      <form @submit.stop.prevent="onSubmit" class="my-2">
        <!-- Linha 1 -->
        <b-row>
          <b-col xl="3">
            <b-form-group
              label="Assunto:"
              label-for="assunto"
              invalid-feedback="Informe o assunto"
            >
              <b-form-input
                id="assunto"
                v-model="v$.form.assunto.$model"
                @input="v$.form.assunto.$reset()"
                @blur="v$.form.assunto.$touch()"
                :state="validateState('assunto')"
              />
            </b-form-group>
          </b-col>

          <b-col xl="3">
            <b-form-group
              label="Unidade de Negócio:"
              label-for="unidade_negocio"
              invalid-feedback="Informe a unidade"
            >
              <b-form-input
                id="unidade_negocio"
                v-model="v$.form.unidade_negocio.$model"
                @input="v$.form.unidade_negocio.$reset()"
                @blur="v$.form.unidade_negocio.$touch()"
                :state="validateState('unidade_negocio')"
              />
            </b-form-group>
          </b-col>

          <b-col xl="3">
            <b-form-group
              label="Dispositivo:"
              label-for="dispositivo"
              invalid-feedback="Informe o dispositivo"
            >
              <b-form-input
                id="dispositivo"
                v-model="v$.form.dispositivo.$model"
                @input="v$.form.dispositivo.$reset()"
                @blur="v$.form.dispositivo.$touch()"
                :state="validateState('dispositivo')"
              />
            </b-form-group>
          </b-col>

          <b-col xl="3">
            <b-form-group
              label="Contato:"
              label-for="contato"
              invalid-feedback="Informe o contato"
            >
              <b-form-input
                id="contato"
                v-model="v$.form.contato.$model"
                @input="v$.form.contato.$reset()"
                @blur="v$.form.contato.$touch()"
                :state="validateState('contato')"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Linha 2 -->
        <b-row>
          <b-col xl="3">
            <b-form-group
              label="Mesa:"
              label-for="mesa_id"
              invalid-feedback="Informe a mesa"
            >
              <b-form-input
                id="mesa_id"
                type="number"
                v-model="v$.form.mesa_id.$model"
                @input="v$.form.mesa_id.$reset()"
                @blur="v$.form.mesa_id.$touch()"
                :state="validateState('mesa_id')"
              />
            </b-form-group>
          </b-col>

          <b-col xl="3">
            <b-form-group
              label="Prioridade:"
              label-for="prioridade"
              invalid-feedback="Selecione a prioridade"
            >
              <b-form-select
                id="prioridade"
                v-model="v$.form.prioridade.$model"
                :options="prioridadeOptions"
                @input="v$.form.prioridade.$reset()"
                @blur="v$.form.prioridade.$touch()"
                :state="validateState('prioridade')"
              >
                <template #first>
                  <b-form-select-option value="" disabled
                    >-- Selecione --</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col xl="3">
            <b-form-group
              label="Tipo de Ticket:"
              label-for="tipo_ticket"
              invalid-feedback="Informe o tipo"
            >
              <b-form-input
                id="tipo_ticket"
                v-model="v$.form.tipo_ticket.$model"
                @input="v$.form.tipo_ticket.$reset()"
                @blur="v$.form.tipo_ticket.$touch()"
                :state="validateState('tipo_ticket')"
              />
            </b-form-group>
          </b-col>

          <b-col xl="3">
            <b-form-group
              label="Categoria:"
              label-for="categoria_id"
              invalid-feedback="Informe a categoria"
            >
              <b-form-input
                id="categoria_id"
                type="number"
                v-model="v$.form.categoria_id.$model"
                @input="v$.form.categoria_id.$reset()"
                @blur="v$.form.categoria_id.$touch()"
                :state="validateState('categoria_id')"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Linha 3 -->
        <b-row>
          <b-col xl="3">
            <b-form-group
              label="Cliente:"
              label-for="cliente_id"
              invalid-feedback="Informe o cliente"
            >
              <b-form-input
                id="cliente_id"
                type="number"
                v-model="v$.form.cliente_id.$model"
                @input="v$.form.cliente_id.$reset()"
                @blur="v$.form.cliente_id.$touch()"
                :state="validateState('cliente_id')"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Descrição -->
        <b-row>
          <b-col>
            <b-form-textarea
              id="descricao"
              rows="3"
              placeholder="Descrição"
              v-model="v$.form.descricao.$model"
              @input="v$.form.descricao.$reset()"
              @blur="v$.form.descricao.$touch()"
              :state="validateState('descricao')"
            />
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col>
            <b-button type="submit" variant="primary">Criar Ticket</b-button>
          </b-col>
        </b-row>
      </form>
    </fieldset>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "CreateTicket",
  setup() {
    const form = reactive({
      assunto: "",
      descricao: "",
      unidade_negocio: "",
      dispositivo: "",
      contato: "",
      mesa_id: "",
      prioridade: "",
      tipo_ticket: "",
      categoria_id: "",
      cliente_id: "",
    });

    const rules = {
      form: Object.fromEntries(Object.keys(form).map((k) => [k, { required }])),
    };
    const v$ = useVuelidate(rules, { form });

    const validateState = (name) => {
      const field = v$.value.form[name];
      return field.$dirty ? !field.$invalid : null;
    };

    const onSubmit = () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        console.log("Ticket criado:", { ...form });
        alert(`Ticket criado!\n${JSON.stringify(form, null, 2)}`);
      }
    };

    const prioridadeOptions = ["Agendado", "Baixa", "Média", "Alta"];

    return { form, v$, validateState, onSubmit, prioridadeOptions };
  },
};
</script>
