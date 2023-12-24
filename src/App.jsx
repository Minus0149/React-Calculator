import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import { MdBackspace } from "react-icons/md";
import "./App.css";
import { useReducer } from "react";

const ACTIONS = {
	ADD_DIGIT: "add-digit",
	CHOOSE_OPERATION: "choose-operation",
	CLEAR: "clear",
	DELETE_DIGIT: "delete",
	EVALUATE: "evaluate",
	CHANGE_SIGN: "change-sign",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-in", {
	maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
	if (operand == null) return;
	const [integer, decimal] = operand.toString().split(".");
	if (decimal == null) return INTEGER_FORMATTER.format(integer);
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.currentOperand === "0" && payload.digit === 0) return state;
			if (
				state.currentOperand.toString().includes(".") &&
				payload.digit === "."
			)
				return state;
			if (state.overwrite) {
				return {
					...state,
					currentOperand: payload.digit,
					overwrite: false,
				};
			}
			return {
				...state,
				currentOperand: `${state.currentOperand || ""}${payload.digit}`,
			};
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperand === "" && state.previourOperand === "") {
				return state;
			}
			if (state.previourOperand === "") {
				return {
					...state,
					operation: payload.operator,
					previourOperand: state.currentOperand,
					currentOperand: "",
				};
			}
			if (state.currentOperand === "") {
				return { ...state, operation: payload.operator };
			}
			return {
				...state,
				previourOperand: evaluate(state),
				operation: payload.operator,
				currentOperand: "",
			};
		case ACTIONS.CLEAR:
			return { currentOperand: "", previourOperand: "", operation: "" };
		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					currentOperand: "",
					overwrite: false,
				};
			}
			if (state.currentOperand === "") return state;
			return {
				...state,
				currentOperand: `${state.currentOperand.substring(
					0,
					state.currentOperand.length - 1
				)}`,
			};
		case ACTIONS.EVALUATE:
			if (
				state.currentOperand === "" ||
				state.previourOperand === "" ||
				state.operation === ""
			)
				return state;
			return {
				...state,
				overwrite: true,
				currentOperand: evaluate(state),
				previourOperand: "",
				operation: "",
			};
		case ACTIONS.CHANGE_SIGN:
			if (state.currentOperand === "") return state;
			if (state.currentOperand[0] === "-")
				return {
					...state,
					currentOperand: `${state.currentOperand.substring(
						1,
						state.currentOperand.length
					)}`,
				};
			return {
				...state,
				currentOperand: `${state.currentOperand[0] !== "-" && "-"}${
					state.currentOperand
				}`,
			};
		default:
			return state;
	}
};

const evaluate = ({ currentOperand, previourOperand, operation }) => {
	const prev = parseFloat(previourOperand);
	const current = parseFloat(currentOperand);
	if (isNaN(prev) || isNaN(current)) return "";
	let computation = "";
	switch (operation) {
		case "+":
			computation = prev + current;
			break;
		case "-":
			computation = prev - current;
			break;
		case "/":
			computation = prev / current;
			break;
		case "X":
			computation = prev * current;
			break;
		case "%":
			computation = prev * (current / 100);
	}
	return computation.toString();
};

const App = () => {
	const btnValues = [
		["C", "+/-", "%", "/"],
		[7, 8, 9, "X"],
		[4, 5, 6, "-"],
		[1, 2, 3, "+"],
		[0, ".", <MdBackspace />, "="],
	];
	const [{ currentOperand, previourOperand, operation }, dispatch] = useReducer(
		reducer,
		{ currentOperand: "", previourOperand: "", operation: "" }
	);

	const checkBtnType = (btn) => {
		if (btn === "=") return "equals";
		if (typeof btn === "object") return "backspace";
		if (typeof btn === "string") {
			if (btn === "C") return "clear";
			if (btn === ".") return "point";
			return "operators";
		}
		return "numbers";
	};
	const handleClick = (btn, e) => {
		if (btn === "C") return dispatch({ type: ACTIONS.CLEAR });
		if (btn === "=") return dispatch({ type: ACTIONS.EVALUATE });
		if (btn === "+/-")
			return dispatch({
				type: ACTIONS.CHANGE_SIGN,
			});
		if (btn === ".")
			return dispatch({
				type: ACTIONS.ADD_DIGIT,
				payload: { digit: btn },
			});
		if (typeof btn === "number")
			return dispatch({
				type: ACTIONS.ADD_DIGIT,
				payload: { digit: btn },
			});
		if (typeof btn === "object")
			return dispatch({
				type: ACTIONS.DELETE_DIGIT,
			});
		return dispatch({
			type: ACTIONS.CHOOSE_OPERATION,
			payload: { operator: btn },
		});
	};

	return (
		<Wrapper>
			<Screen
				className="formula"
				value={previourOperand ? formatOperand(previourOperand) : ""}
			/>

			<Screen
				className="output"
				value={`${
					previourOperand ? formatOperand(previourOperand) : ""
				} ${operation} ${currentOperand ? formatOperand(currentOperand) : ""}`}
			/>

			<ButtonBox>
				{btnValues.flat().map((btn, i) => {
					return (
						<Button
							key={i}
							className={checkBtnType(btn)}
							value={btn}
							btnType={checkBtnType(btn)}
							onClick={() => handleClick(btn)}
						/>
					);
				})}
			</ButtonBox>
		</Wrapper>
	);
};

export default App;
