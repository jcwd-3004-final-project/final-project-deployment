interface ModalProps<T> {
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    data: T;
    onDataChange: (newData: T) => void;
  }
  
  const Modal = <T extends Record<string, any>>({
    title,
    onClose,
    onSubmit,
    data,
    onDataChange,
  }: ModalProps<T>) => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <form onSubmit={onSubmit}>
            {Object.keys(data).map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-gray-700" htmlFor={field}>
                  {field.replace('_', ' ').toUpperCase()}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={data[field]} // Type-safe access to fields
                  onChange={(e) =>
                    onDataChange({ ...data, [field]: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 py-2 px-4 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-green-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Modal;
  