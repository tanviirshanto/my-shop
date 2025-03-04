// components/CustomerSelect.tsx
import { Select } from 'daisyui';
import { Customer } from '@/models';
import { connectDB } from '@/lib/db';

export default function CustomerSelect({ value, onChange }) {
  [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      await connectDB();
      const customers = await Customer.find().select('_id name');
      setCustomers(customers);
    }
    fetchCustomers();
  }, []);

  return (
    <Select value={value} onChange={onChange}>
      <option value="">Select Customer</option>
      {customers.map(customer => (
        <option key={customer._id} value={customer._id}>
          {customer.name}
        </option>
      ))}
    </Select>
  );
}
