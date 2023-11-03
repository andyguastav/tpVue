Vue.component('expense-form', {
    props: ['editingIndex'],
    data() {
        return {
            formData: {
                date: '',
                amount: '',
                category: '',
                description: '',
            }
        };
    },
    computed: {
        editing() {
          return this.editingIndex !== -1;
        },
        buttonText() {
            return this.editing ? 'Modificar' : 'Agregar';
        },
        
      },
    methods: {
        addExpense() {
            if (this.formData.amount && this.formData.category) {
                this.$root.expenses.push({
                    date: this.formData.date,
                    amount: parseFloat(this.formData.amount),
                    category: this.formData.category,
                    description: this.formData.description,
                });

                this.resetFormData();
                this.cancelEdit();
            }
        },

        saveExpense(index) {
            if (this.formData.amount && this.formData.category) {
                // Actualizar el gasto con los nuevos valores
                const updatedExpense = {
                    date: this.formData.date,
                    amount: parseFloat(this.formData.amount),
                    category: this.formData.category,
                    description: this.formData.description,
                };
        
                // Reemplazar el elemento en el arreglo
                this.$root.expenses[index] = updatedExpense;
                
                Vue.set(this.$root.expenses, index, updatedExpense);
        
                this.resetFormData();
                this.cancelEdit();
                this.$emit('save-expense');
            }
        },
        

        resetFormData() {
            this.formData = {
                date: '',
                amount: '',
                category: '',
                description: '',
            };
        },
        cancelEdit() {
            this.$root.editingIndex = -1;
          },
    },
    watch: {
        editingIndex(newValue) {
            if (newValue !== -1) {
                const expenseToEdit = this.$root.expenses[newValue];
                this.formData = {
                    date: expenseToEdit.date,
                    amount: expenseToEdit.amount,
                    category: expenseToEdit.category,
                    description: expenseToEdit.description,
                };
            } else {
                this.resetFormData();
            }
        },
    },
    template: `
        <div>
            <h2 class="text-center" id="agregarGasto">Registro de Gastos</h2>
            <form>
                <label>Fecha:
                    <input v-model="formData.date" type="date" required>
                </label>
                <label>Categoría:
                    <input v-model="formData.category" type="text" required>
                </label>
                <label>Descripción:
                    <input v-model="formData.description" type="text">
                </label>
                <label>Monto:
                    <input v-model="formData.amount" type="number" step="0.01" required>
                </label>
                <button type="button" @click="editingIndex === -1 ? addExpense() : saveExpense(editingIndex)"
                v-bind:class="{ 'green-background': buttonText === 'Agregar', 'yellow-background': buttonText === 'Modificar' }">
                {{ buttonText }}
                </button>
                <button type="button" @click="cancelEdit" v-if="editing" class="cancel-button">Cancelar</button>
            </form>
        </div>
    `,
});

Vue.component('expense-list', {
    props: ['expenses'],
    methods: {
        getTotalByCategory(category) {
            return this.expenses.reduce((total, expense) => {
                if (expense.category === category) {
                    return total + expense.amount;
                }
                return total;
            }, 0);
        },

        deleteExpense(index) {
            if (confirm("¿Seguro que desea eliminar este gasto?")) {
                this.expenses.splice(index, 1);
            }
        },

        editExpense(index) {
            this.$emit('edit-expense', index);
        },
    },
    template: `
        <div>
            <h2 class="text-center" id="misGastos">Lista de Gastos</h2>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(expense, index) in expenses" :key="index">
                        <td>{{ expense.date }}</td>
                        <td>{{ expense.category }}</td>
                        <td>{{ expense.description }}</td>
                        <td>{{ expense.amount }}</td>
                        <td>
                            <button @click="deleteExpense(index)">Eliminar</button>
                            <button @click="editExpense(index)">Editar</button>
                        </td>
                            
                    </tr>
                </tbody>
            </table>
            <h3 class="text-center" id="estadisticas">Estadísticas</h3>
            <div v-for="category in uniqueCategories" :key="category">
                <strong>{{ category }}:</strong> {{ getTotalByCategory(category) }}
            </div>
        </div>
    `,
    computed: {
        uniqueCategories() {
            return [...new Set(this.expenses.map(expense => expense.category))];
        }
    }
});

new Vue({
    el: '#app',
    data: {
        expenses: [],
        editingIndex: -1,
        showHomePage:true,//Muestra la pagina de inicio.
        activeTab: 'agregarGasto',
    },
    methods: {

        changeTab(tab) {
            this.activeTab = tab;
        },
        showApp() {
            this.showHomePage  = false; // se Muestra la app principal.
        },
        handleEditExpense(index) {
            this.editingIndex = index;
        },
        handleSaveExpense() {
            this.editingIndex = -1;
        },
    },
});
