function InputField(props) {
    if (props.type === 'select') {
        return (
            <div className={"sm:mb-3 mb-0.5" + props.CN}>
                <label className="block text-gray-700 text-sm font-bold mb-0.5 sm:mb-2" htmlFor={props.id}>
                    {props.labelText}
                </label>
                <select
                    className="flex shadow appearance-none border rounded w-full py-1.5 px-1 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    required
                >
                    <option value="0">
                            -- seleccione {props.name} --
                        </option>
                    {props.options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    } else {
        return (
            <div className={"sm:mb-3 mb-0.5 " + props.CN}>
                <label className="block text-gray-700 text-sm font-bold mb-0.5 sm:mb-2" htmlFor={props.id}>
                    {props.labelText}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-1.5 px-1 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={props.id}
                    type={props.type}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    required
                />
            </div>
        );
    }
}

export default InputField;