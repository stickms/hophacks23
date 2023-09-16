// Operating under the assumption that an array of all the course numbers "course_numbers" already exists

let sisApiKey = "64zIoctOLVcnxmxho2k8Ae0MnQiJh5hA";

let course_numbers = [
  "AS11030201",
  "AS17120102",
  "AS17220301",
  "EN57047001",
  "EN60123005",
  "EN60128002",
];

async function getCourseDescriptions(course_numbers) {
  let course_map = {};
  for (course_number of course_numbers) {
    let URL = `https://sis.jhu.edu/api/classes/${course_number}?key=${sisApiKey}`;
    try {
      console.log(`FETCHING: ${URL}`);
      const response = await fetch(URL);
      const data = await response.json();
      course_map[course_number] = data[0]["SectionDetails"][0]["Description"];
      console.log(`${course_number} DESCRIPTION:`);
      console.log(data[0]["SectionDetails"][0]["Description"]);
      console.log(`\n`);
    } catch {
      continue;
    }
  }
  console.log(`Course map: ${JSON.stringify(course_map)}`);
}

getCourseDescriptions(course_numbers);
