import Cookies from "js-cookie";

import { USER_ROLE, GROUP_FILTER_TYPE, USER_COOKIE } from "./constants";

export function sortMemberListByRole(data) {
  const sortingScheme = [USER_ROLE.OWNER, USER_ROLE.CO_OWNER, USER_ROLE.MEMBER];

  const compare = (a, b) => {
    const indexOfa = sortingScheme.indexOf(a.role);
    const indexOfb = sortingScheme.indexOf(b.role);

    if (indexOfa > indexOfb) {
      return 1;
    }

    if (indexOfa < indexOfb) {
      return -1;
    }

    return 0;
  };

  return data.sort(compare);
}

export function getUserId() {
  const userString = Cookies.get(USER_COOKIE);

  const user = JSON.parse(userString || "");

  return user?.id;
}

export function filterGroupByType(groups, type, userId) {
  switch (type) {
    case GROUP_FILTER_TYPE.GROUP_YOU_CREATED: {
      return groups.filter((group) => group.userCreated._id === userId);
    }

    case GROUP_FILTER_TYPE.GROUP_YOU_JOINED: {
      return groups.filter((group) => group.userCreated._id !== userId);
    }

    default: {
      return groups;
    }
  }
}

export function isValidUrl(value) {
  return value.match(
    /https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/
  );
}
