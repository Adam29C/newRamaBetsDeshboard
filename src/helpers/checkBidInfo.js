import moment from "moment";
import dateTime from "node-datetime";

const checkBid=(OBT, CBT, session, gameDay)=> {
	const OpenTime = OBT;
	const CloseTime = CBT;
	const day = gameDay;
	const dt3 = dateTime.create();
	const time = dt3.format("I:M p");
	const current = moment(time, "HH:mm a");
	const endTime = moment(CloseTime, "HH:mm a");
	const startTime = moment(OpenTime, "HH:mm a");
	const dt2 = dateTime.create();
	const todayDay = dt2.format("W");
	let status = 1;

	if (day == todayDay) {
		if (session === "Open") {
			if (current > startTime) {
				status = 0;
			}
		} else {
			if (current > endTime) {
				status = 0;
			}
		}
		return Promise.resolve(status);
	} else {
		return Promise.resolve(status);
	}
};
export{checkBid}