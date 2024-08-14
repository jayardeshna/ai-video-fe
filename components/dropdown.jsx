export const Dropdown = ({ title, options, setValue }) => {
    const handleLanguageChange = (e) => {
        setValue(e.target.value); // Update state with selected language
      };
  return (
    <div className="mt-6">
      <label
        htmlFor="language"
        className="block text-sm font-medium text-gray-700"
      >
        Select {title}
      </label>
      <select
        id="language"
        name="language"
        onChange={handleLanguageChange}
        className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {options.map((option) => {
          return <option value={option} >{option}</option>;
        })}
      </select>
    </div>
  );
};
