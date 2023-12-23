import "./Button.css";

const Button = ({ id, className, value, onClick, btnType }) => {
	return (
		<button
			id={id}
			className={className}
			onClick={onClick}
			onTouchStart={() => {
				document
					.getElementById(`button-${value}`)
					.classList.add(`${btnType}-active`);
			}}
			onTouchEnd={() => {
				document
					.getElementById(`button-${value}`)
					.classList.remove(`${btnType}-active`);
			}}
		>
			{value}
		</button>
	);
};

export default Button;
