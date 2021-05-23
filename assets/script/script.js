const mobileNav = document.getElementById('mobile-nav')
const mobileAvatar = document.getElementById('mobile-avatar')
const desktopAvatar = document.getElementById('desktop-avatar')
const mobileProfileName = document.getElementById('mobile-profile-name')
const desktopProfileName = document.getElementById('desktop-profile-name')
const namesImage = document.getElementById('names--image')
const namesWrapFullname = document.getElementById('names--wrap__fullname')
const namesWrapUsername = document.getElementById('names--wrap__username')
const summaryDescription = document.getElementById('summary--bio')
const profileLinkEmail = document.getElementById('profile--link-email')
const profileLinkUrl = document.getElementById('profile--link-url')
const profileLinkTwitter = document.getElementById('profile--link-twitter')
const profileLinkLocation = document.getElementById('profile--link-location')
const profileLinkFollowers = document.getElementById('profile--link-followers')
const profileLinkFollowing = document.getElementById('profile--link-following')
const organizations = document.getElementById('organizations')
const tabLinkRepo = document.getElementById('tab--link--repo')
const repositories = document.getElementById('repositories')

const openMobileNav = () => {
  mobileNav.classList.toggle('mobile-nav--show')
}

let user;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  },
  body: JSON.stringify({
    query: `
      query { 
        user(login: "I-GiM") {
          avatarUrl
          bio
          company
          email
          followers(first: 100) {
            totalCount
          }
          following(first: 100) {
            totalCount
          }
          location
          login
          name
          organizations(first: 20) {
            totalCount
            nodes {
              avatarUrl
              description
              login
              name
              memberStatuses(first: 20) {
                totalCount
              }
              membersWithRole(first: 20) {
                totalCount
              }
              repositories(first: 5) {
                totalCount
              }
              url
            }
          }
          repositories(orderBy: {
            field: PUSHED_AT,
            direction: DESC
          }, first: 20) {
            nodes {
              description
              forkCount
              isFork
              forks(ownerAffiliations: OWNER, last: 10) {
                nodes {
                  description
                }
              }
              languages(orderBy: {
                field: SIZE
                direction: DESC
              }, last: 10) {
                nodes {
                  color
                  name
                }
              }
              name
              pushedAt
              updatedAt
              stargazerCount
              owner {
                login
              }
              licenseInfo {
                id
                description
                name
                nickname
              }
            }
            totalCount
          }
          twitterUsername
          watching(first: 100) {
            totalCount
          }
          websiteUrl
        }
      }
    `
  })
})
.then(res => res.json())
.then(data => {
  user = data.data.user
  console.log(user)
  mobileAvatar.src = user.avatarUrl
  desktopAvatar.src = user.avatarUrl
  mobileProfileName.innerText = user.login || ''
  desktopProfileName.innerText = user.login || ''

  namesImage.src = user.avatarUrl
  namesWrapFullname.innerText = user.name || ''
  namesWrapUsername.innerText = user.login || ''

  summaryDescription.innerText = user.bio || ''
  profileLinkEmail.innerText = user.email || ''
  profileLinkEmail.parentElement.href = `mailto:${user.email}` || ''
  profileLinkUrl.innerText = user.websiteUrl || ''
  profileLinkUrl.parentElement.href = user.websiteUrl || ''
  profileLinkTwitter.innerText = `@${user.twitterUsername}` || ''
  profileLinkTwitter.parentElement.href = `https:twitter.com/${user.twitterUsername}` || ''
  profileLinkLocation.innerText = user.location || ''
  profileLinkFollowers.innerText = `${user.followers.totalCount} followers` || ''
  profileLinkFollowing.innerText = `${user.following.totalCount} following` || ''

  organizations.innerHTML = user.organizations.nodes.map(org => {
    return `<a href=${org.url} class="org--link">
      <img src=${org.avatarUrl} class="org--img" />
    </a>`
  }).join('')

  tabLinkRepo.innerText = user.repositories.totalCount

  repositories.innerHTML = user.repositories.nodes.map(repo => {
    return `
      <div class="repo-wrap">
        <div class="details">
          <div class="repo-name">
            <a href="" class="name-of-repo">${repo.name}</a>
            <p class="forked" style="display: ${repo.isFork ? 'block' : 'none'};">Forked from ${repo.name.toLowerCase()}</p>
          </div>
          <p class="repo-description">${repo.description  ? repo.description : ''}</p>
          <div class="repo-meta">
            <div class="repo-lang">
              <span class="lang-color" style="background-color: ${repo.languages.nodes.slice(0,1).map(l => {
                  return l.color
                })}"></span>
              <span class="lang-name">
                ${repo.languages.nodes.length > 0 ? repo.languages.nodes.slice(0,1).map(l => {
                  return l.name
                }) : ''}
              </span>
            </div>
            <div class="fork-details" style="display: ${repo.isFork ? 'block' : 'none'};">
              <svg aria-label="fork" fill="#8b949e" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
              <span class="fork-total"></span>
            </div>
            <div class="license" style="display: ${repo.licenseInfo !== null ? 'block' : 'none'};">
              <svg fill="#8b949e" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>
              <span class="license-name">${repo.licenseInfo !== null ? repo.licenseInfo.name : ''}</span>
            </div>
            <p class="time-stamp">
              Updated at ${new Date(repo.updatedAt).toDateString()}
            </p>
          </div>
        </div>
        <button class="summary--profile btn-star">
          <svg fill="#8b949e" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
          Star
        </button>
      </div>
    `
  }).join('')
})


