export const path = {
    ROOT_PATH_NORMAL: "/home/",
    ROOT_ADMIN: "/admin/",
    HOMEPAGE: '/home',
    LOGIN: '/login',
    REGISTER: '/register',
    LOG_OUT: '/logout',
    SYSTEM: '/admin',
    TEACHER: {
        MY_CLASS: "teacher/my-class",
        DETAIL_CLASS: "teacher/detail-class",
        QUESTION_DICTIONARY: "teacher/question-dictionary",
        MONITOR_THE_EXAM: "teacher/monitor-the-exam",
        FORM_MONITOR: "teacher/form-monitor"
    },
    STUDENT: {
        MY_CLASS: "student/my-class",
        DETAIL_CLASS: "student/detail-class",
        MISSION: "student/misson",
        ACCOUNT_LINK: "student/account-link",
        DETAIL_ASSIGNMENT: "student/detail-assignment",
        DETAIL_EXAM: "student/detail-exam",
        WORK_FORM: "student/work-form",
        FORM_EXAM: "student/form-exam",
    },
    PARENTS: {
        MY_CLASS: "parents/class",
        DETAIL_CLASS: "parents/detail-class",
        MISSION: "parents/misson",
        ACCOUNT_LINK: "parents/account-link"
    },
    ADMIN: {
        MANAGE_USER: "manage-user",
        MANAGE_CLASS: "manage-class",
        MANAGE_QUESTION: "manage-question",
        MANAGE_RESULT_HISTORY: "manage-result-history"
    },
    EXAM: "process-exam",
    CONTACT: "Contact"
};

export const languages = {
    VI: 'VI',
    EN: 'EN'
};

export const NAME_LOCAL_STORED = 'vantai_load_user'
export const NAME_BACK_LOCATION = 'back_location'
export const SCROLL_BACK_LOCATION = 'scroll_back_location'

export const manageActions = {
    ADD: "ADD",
    EDIT: "EDIT",
    DELETE: "DELETE"
};

export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N'
}

export const roleId = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: "STUDENT",
    PARENTS: "PARENTS",
}

export const gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
}

export const linkAvatarDefault = {
    MALE: 'https://th.bing.com/th/id/OIP.LNc4A3inta5VbQTHVF_ipgAAAA?pid=ImgDet&rs=1',
    FEMALE: "https://th.bing.com/th/id/OIP.gDZNFmTo3c8r6oIdhYyNEwAAAA?pid=ImgDet&rs=1",
    OTHER: "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
}



export const category_book = {
    COMIC: 'C1',
    TEXTBOOKS: 'C2',
    REFBOOK: "C3",
    SKILLBOOK: 'C4'
}

export const status_cart = {
    BORROWING: 'B',
    WAITING: "W"
}

export const title_notify = {
    ADMIN: "A",
    MESSAGE: "M",
    SYSTEM: "ST",
    USER: "U"
}

export const keyMap_period = {
    IN_THE_DATE: 'D',
    ON_WEEK: 'W',
    IN_MONTHS: 'M',
    PERIOD: 'P',
}

export const period = [
    { keyMap: "D", valueEn: "In the Date", valueVi: "Trong Ngày" },
    { keyMap: "W", valueEn: "On Week", valueVi: "Trong tuần" },
    { keyMap: "M", valueEn: "In Months", valueVi: "Trong tháng" },
    { keyMap: "P", valueEn: "Period", valueVi: "Trong Khoảng" },
]

export const environment = {
    // REACT_APP_URL_BACK_END:"https://book-library-be.onrender.com",
    REACT_APP_URL_BACK_END: "http://localhost:5000",
    REACT_APP_LOCAL_STORE_TOKEN_NAME: "jhdhajhdauyeiqeyqeiqu",
    REACT_APP_LOCAL_STORE_TOKEN_NAME: "vantai"
}


export const processId = {
    DONE: "DONE",
    UNFINISHED: "UNFINISHED",
    UNDER_FIVE: "UNDER_FIVE",
    FIVE_TO_SEVEN: "FIVE_TO_SEVEN",
    EIGHT_TO_TEN: "EIGHT_TO_TEN",
}

export const exam_statusId = {
    CLOSE: "CLOSE",
    OPEN: "OPEN",
}

export const question_typeId = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
}

export const type_modalId = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
}

export const exam_typeId = {
    ASSIGNMENT: "ASSIGNMENT",
    EXAM: "EXAM"
}

export const time_type = {
    NO_HOURS: "DD/MM/YYYY",
}

export const confirm_type = {
    DOCUMENT: "DOCUMENT",
    ASSIGNMENT: "ASSIGNMENT",
    EXAM: "EXAM",
    DEL_STUDENT: "DEL_STUDENT",
    DEL_CLASS: "DEL_CLASS",
}

export const notify_typeId = {
    STUDENT_REQ_JOIN_CLASS: "STUDENT_REQ_JOIN_CLASS",
    TEACHER_REQ_JOIN_CLASS: "TEACHER_REQ_JOIN_CLASS",
    NOTIFY: "NOTIFY",
    PARENT_REQ_LINK_ACCOUNT: "PARENT_REQ_LINK_ACCOUNT",
}

export const email_typeId = {
    SEND_TO_INVIGILATOR: "SEND_TO_INVIGILATOR",

}
