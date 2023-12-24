import "./Button.css";

const Button = ({ id, className, value, onClick, btnType }) => {
	return (
		<button
			id={id}
			className={className}
			onClick={onClick}
			onTouchStart={(e) => {
				e.target.classList.add(`${btnType}-active`);
			}}
			onTouchEnd={(e) => {
				e.target.classList.remove(`${btnType}-active`);
			}}
		>
			{value}
		</button>
	);
};

export default Button;
