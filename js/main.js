import {CATEGORY_LIST} from './modules/consts/category-list.js'
import {Randomizer} from './modules/utils/randomizer.js'

// ----- DOM -----

const newGameButton = document.querySelector('.js-new')
const cancelButton = document.querySelector('.js-cancel')
const elementsToHide = document.querySelectorAll(
  '.js-game > *:not(nav), .js-ranking, .js-cancel'
)

const resetGame = () => {
  elementsToHide.forEach((element) => {
    element.classList.add('d-none')
  })
}

newGameButton.addEventListener('click', () => {
  elementsToHide.forEach((element) => {
    element.classList.remove('d-none')
  })
  round++
  loadQuestions(round, randomizedCategories, apiToken)
})

cancelButton.addEventListener('click', () => {
  resetGame()
  newGameButton.classList.remove('d-none')
})

const getApiToken = async () => {
  try {
    const fetchResult = await fetch(
      'https://opentdb.com/api_token.php?command=request'
    )
    const resultJson = await fetchResult.json()
    const token = resultJson.token
    return token
  } catch (err) {
    console.log(err)
  }
}

const fetchCategories = async () => {
  try {
    const fetchResult = await fetch(api_url)
    const resultJson = await fetchResult.json()
    const data = resultJson.trivia_categories
    return data
  } catch (err) {
    console.log(err)
  }
}

const fetchQuestion = async (apiToken, category_id) => {
  try {
    const fetchResult = await fetch(
      `https://opentdb.com/api.php?amount=1&category=${category_id}&token=${apiToken}`
    )
    const resultJson = await fetchResult.json()
    const results = resultJson.results
    return results
  } catch (err) {
    console.log(err)
  }
}

const getUpdatedCategories = async () => {
  const updatedCategories = []
  const categoriesFromApi = await fetchCategories()
  categoriesFromApi.forEach((category) => {
    if (CATEGORY_LIST.includes(category.name)) {
      updatedCategories.push(category)
    }
  })
  return updatedCategories
}

const loadQuestions = async (round, updatedCategories, apiToken) => {
  const question = await fetchQuestion(apiToken, updatedCategories[round].id)
  questions.push(question[0])
  console.log('questions: ', questions)
  renderQuestion(round - 1, questions)
}

const renderQuestion = (round, questions)=>{
  const question = questions[round]
  
}

const api_url = 'https://opentdb.com/api_category.php'
let round = 0
const apiToken = await getApiToken()
const updatedCategories = await getUpdatedCategories()
const randomizedCategories = Randomizer.randomizeArray(updatedCategories)
const questions = []



resetGame()
loadQuestions(round, randomizedCategories, apiToken)