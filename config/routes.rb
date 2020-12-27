Rails.application.routes.draw do
  devise_for :users, :controllers => {
    :confirmations => 'users/confirmations',
    :passwords => 'users/passwords',
    :registrations => 'users/registrations',
    :sessions => 'users/sessions',
    :unlocks => 'users/unlocks'
   }

  get 'home/index'
  get 'home/show'

  root to: "home#index"

  ## 開発環境用letter_opener
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
