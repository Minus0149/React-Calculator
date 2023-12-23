import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import { MdBackspace } from "react-icons/md";
import "./App.css";

const App = () => {
	const btnValues = [
		["C", "+/-", "%", "/"],
		[7, 8, 9, "X"],
		[4, 5, 6, "-"],
		[1, 2, 3, "+"],
		[0, ".", <MdBackspace />, "="],
	];
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
	return (
		<Wrapper>
			<Screen value="0" />
			<ButtonBox>
				{btnValues.flat().map((btn, i) => {
					return (
						<Button
							key={i}
							id={`button-${btn}`}
							className={checkBtnType(btn)}
							value={btn}
							btnType={checkBtnType(btn)}
							onClick={() => {
								console.log(`${btn} clicked!`);
							}}
						/>
					);
				})}
			</ButtonBox>
		</Wrapper>
	);
};

export default App;
