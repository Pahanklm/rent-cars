import * as flsFunctions from './modules/functions.js';
flsFunctions.isWebp();

import AirDatepicker from 'air-datepicker';
import choices from 'choices.js';

const form = document.querySelector('.calendar__form');
const selectElement1 = document.querySelector('.calendar__select1');
const selectElement2 = document.querySelector('.calendar__select2');
const calendarBtn = document.querySelector('.calendar__btn');
const selectElements = [selectElement1, selectElement2];
const currentDate = new Date();
const day = currentDate.getDate();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const year = currentDate.getFullYear();

const errorMessage = document.createElement('span');
errorMessage.classList.add('error-message');
form.insertAdjacentElement('afterend', errorMessage);

let button = {
    content: 'Сьогодні',
    onClick: (dp) => {
        let date = currentDate;
        dp.selectDate(date);
        dp.setViewDate(date);
    },
};

function compareTime(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 !== hours2) {
        return hours1 > hours2 ? -1 : 1;
    }

    if (minutes1 !== minutes2) {
        return minutes1 > minutes2 ? -1 : 1;
    }

    return 0;
}

selectElements.forEach(function (selectElement) {
    selectElement.addEventListener('change', function () {
        let date1 = airdatepicker1.value;
        let date2 = airdatepicker2.value;
        let time1 = selectElement1.textContent;
        let time2 = selectElement2.textContent;

        updateErrorMessage(date1, date2, time1, time2);
        updateCalendarButton(); // Check and update the calendar button state
    });
});

function addTimeOptions() {
    let date1 = airdatepicker1.value;
    const currentTime = new Date();
    let startTime;
    const today = `${day}.${month}.${year}`;

    if (date1 === today) {
        startTime = new Date(
            Math.ceil(currentTime.getTime() / (30 * 60 * 1000)) *
                (30 * 60 * 1000)
        );
    }
    if (date1 !== today) {
        startTime = new Date();
        startTime.setHours(9, 0, 0, 0); // Set the initial time, in this case, 9:00
    }
    const endTime = new Date(currentTime); // End time
    endTime.setHours(23, 59, 0); // Set the end time, in this case, 18:00

    const timeOptions = [];

    while (startTime <= endTime) {
        const optionText = startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        const optionValue = startTime.toISOString();

        timeOptions.push({ label: optionText, value: optionValue });

        startTime.setTime(startTime.getTime() + 30 * 60 * 1000);
    }
    return timeOptions;
}

function updateErrorMessage(date1, date2, time1, time2) {
    if (date1 > date2 && date1 !== '' && date2 !== '') {
        errorMessage.textContent = 'lfksdjkfd';
    } else if (date1 === date2 && date1 !== '' && date2 !== '') {
        if (compareTime(time1, time2) < 1) {
            errorMessage.textContent =
                'Время конца аренды не может быть раньше или в то же время что и начало';
        } else {
            errorMessage.textContent = '';
        }
    } else {
        errorMessage.textContent = '';
    }
}

function updateCalendarButton() {
    if (errorMessage.textContent !== '') {
        calendarBtn.disabled = true;
    } else {
        calendarBtn.disabled = false;
    }
}
selectElement1.choices = new choices(selectElement1, {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
    choices: addTimeOptions(),
    allowHTML: true,
});

selectElement2.choices = new choices(selectElement2, {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
    choices: addTimeOptions(),
    allowHTML: true,
});

document.addEventListener('DOMContentLoaded', function () {
    console.log(currentDate);
    new AirDatepicker('#airdatepicker1', {
        startDate: currentDate,
        minDate: currentDate,
        container: 'calendar',
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date, formattedDate, datepicker }) {
            let date1 = airdatepicker1.value;
            let date2 = airdatepicker2.value;
            let time1 = selectElement1.textContent;
            let time2 = selectElement2.textContent;

            updateErrorMessage(date1, date2, time1, time2);
            updateCalendarButton(); // Check and update the calendar button state

            if (selectElement1.choices) {
                selectElement1.choices.destroy();
            }
            if (selectElement2.choices) {
                selectElement2.choices.destroy();
            }

            selectElement1.choices = new choices(selectElement1, {
                searchEnabled: false,
                shouldSort: false,
                itemSelectText: '',
                choices: addTimeOptions(),
                allowHTML: true,
            });

            selectElement2.choices = new choices(selectElement2, {
                searchEnabled: false,
                shouldSort: false,
                itemSelectText: '',
                choices: addTimeOptions(),
                allowHTML: true,
            });
        },
        locale: {
            // Locale settings
        },
    });

    new AirDatepicker('#airdatepicker2', {
        minDate: currentDate,
        startDate: currentDate,
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date, formattedDate, datepicker }) {
            let date1 = airdatepicker1.value;
            let date2 = airdatepicker2.value;
            let time1 = selectElement1.textContent;
            let time2 = selectElement2.textContent;

            updateErrorMessage(date1, date2, time1, time2);
            updateCalendarButton(); // Check and update the calendar button state
        },
        locale: {
            // Locale settings
        },
    });
});

// Check and update the calendar button state on page load
updateCalendarButton();
