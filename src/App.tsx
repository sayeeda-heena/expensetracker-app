import React,{ useState, useEffect } from 'react';
import './index.css'

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

const App: React.FC = () => {
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [text, setText] = useState<string>("");
  const [ amount, setAmount ] = useState<string>("");
  const [editId, setEditId ] = useState<number | null>(null);


  //Load from localStorage

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
     setTransactions(JSON.parse(saved));
    }
  },[]);
  
  //Save to localStorage
  useEffect(() => {
    if(transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  },[transactions]);

//Add or update transaction
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

const numericAmount = Number(amount);
  if (!text.trim() || numericAmount === 0 || isNaN(numericAmount)) {
     alert("Please fill both fields");
     return;
  }

  if (editId) {
    setTransactions((prev) => 
      prev.map((t) => 
      t.id === editId ? {...t, text, amount: numericAmount} : t));
    setEditId(null);
  }else{
    const newTransaction = {id: Date.now(), text, amount: numericAmount};
    setTransactions((prev) => [...prev, newTransaction])
  }

  setText("");
  setAmount("");
};


const handleDelete = (id: number) => {
  setTransactions(transactions.filter((t) => t.id !== id));
};

const handleEdit = (id: number) => {
  const toEdit = transactions.find((t) => t.id === id);

  if(toEdit) {
    setText(toEdit.text);
    setAmount(String(toEdit.amount));
    setEditId(id);
  }
};

const income = transactions
.filter((t) => t.amount > 0)
.reduce((acc, t) => acc + t.amount, 0);

const expense = transactions
.filter((t) => t.amount < 0)
.reduce((acc, t) => acc + t.amount, 0);

const balance = income + expense;

return (
  
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-6">
      <h1 className="text-2xl font-bold text-center mb-4">💰 Expense Tracker</h1>

      <div className='bg-indigo-50 rounded-xl p-4 mb-6 text-center'>
        <h2 className='text-gray-700 text-lg font-semibold mb-1'>Your Balance</h2>
      <p className='text-2xl font-bold text-indigo-700'>${balance.toFixed(2)}</p>

      <div className='flex justify-between mt-4'>
        <div className='bg-gray-300 p-3 rounded-xl flex-1 mr-2'>
          <h3 className='text-sm font-semibold text-gray-600'>Income</h3>
          <p className='text-lg font-bold text-gray-700'>${income.toFixed(2)}</p>
        </div>

        <div className='bg-gray-300 p-3 rounded-xl flex-1 ml-2'>
          <h3 className='text-sm font-semibold text-gray-600'>Expense</h3>
          <p className='text-lg font-bold text-gray-700'>${Math.abs(expense).toFixed(2)}</p>
        </div>
       </div>
      </div>
         

         <form onSubmit={handleSubmit} className='space-y-3 mb-6'>
          <input
           type="text" 
           placeholder='Enter text...'
           value={text} 
           onChange={(e) => setText(e.target.value)}
           className='w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400'/>

           <input type="number" 
           placeholder="Enter amount(+income, -expense)"
           value={amount}
           onChange={(e) => setAmount(e.target.value)}
           className='w-full border border-gray-300 p-2 rounded-xl 
           focus:outline-none focus:ring-2 focus:ring-indigo-400'/>

         <button type="submit" 
         className={`w-full ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-indigo-600 hover:bg-indigo-700"} text-white py-2 rounded-xl transiton-all`}>
          {editId ? "Update Transaction" : "Add Transaction"}
         </button>

         {editId && (
          <button type="button"
          onClick={() => {setEditId(null);setText("");setAmount(0);}} className='w-full bg-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-400 transition-all'>
            Cancel Edit
         </button>
         )}
         </form>

         <h3 className='text-lg font-semibold text-gray-700 mb-2'>History</h3>
         <ul className=' space-y-2 max-h-60 overflow-y-auto'>
          {transactions.length === 0 ? (
            <p className='text-gray-500 text-center'>No transactions yet.</p>
          ) : (
            transactions.map((t) => (
              <li key={t.id} className= {`flex justify-between items-center p-3 rounded-xl border-l-4 
                ${t.amount > 0 ? "border-gray-500 bg-gray-50" : "border-red-500 bg-red-50"}`}>
                  <span className='font-medium'>{t.text}</span>
                  <div className='flex justify-center space-x-3'>
                    <span className={`${t.amount > 0 ? "text-gray-600" : "text-red-600"} font-bold`}>{t.amount > 0 ? "+" : ""}{t.amount}

                    </span>

                    <button onClick={() => handleEdit(t.id)} className='text-blue-500 hover:text-blue-700 transition-all'>Edit</button>
                     <button onClick={() => handleDelete(t.id)} className='text-gray-500 hover:text-gray-700 transition-all'>Delete</button>
                  </div>
                </li>
            ))
          )}

         </ul>
        </div>
        </div>
)
}

  

  




export default App
