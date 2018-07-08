---
title:  "Publish to App Store with fastlane"
date:   2018-07-07 01:00:00 +0200
category: ios
preview_icon: categories/code.png
banner: /assets/banners/fastlane.jpg
comments: true
---

Three years ago at the [Pragma Conference](http://2015.pragmaconference.com/) in Florence, Italy, I heard about a tool to help streamline iOS app development and publishing to the App Store: [fastlane.tools](https://fastlane.tools/). It is only recently I decided to give it a closer look. And it is great, really great and really simplify releasing apps to Apple and Google app stores.

<!-- more -->

Automation. One word I'm always after when it comes to software development. Having to do the same tedious tasks twice is painful and developers want to avoid this, I want to avoid this.

In one of my previous jobs, we used to have a set of batch files here and there to deliver the product. It was a small startup, and one developer had this magic script to build the Java archive and then this JAR file could be sent to clients. I converted the batch file to [Ant](https://ant.apache.org/) (_this was in the early 2000s_), from compilation to the generation of installers. And then because it did not make sense to expect one single developer to be in charge of running a script, [CruiseControl](http://cruisecontrol.sourceforge.net/), a CI/CD platform, was added into the fix. Everything was automated, build, documentation, tests, installers.

Since that time, I chase these _automatable_ tasks and whenever I get a chance, just write the script that will save me precious time that can be spent on more valuable tasks.

These days I have an idea for an app and I started working on it. Few years ago I published an app to the App Store. Everything was done manually, building the app from XCode, capturing screenshots from the simulator, formatting the screenshots, updating the app description in all languages from the iTunes Connect website, uploading the build, submitting for review. A lot of pain and error prone. So this is a very good opportunity to try out **fastlane**.

> fastlane is an open source platform aimed at simplifying Android and iOS deployment.
> fastlane lets you automate every aspect of your development and release workflow.

fastlane includes several tools to achieve its goal: match, pilot, deliver to name of few, together with a set of plugins - like one to generate icons for all device sizes from one large PNG image. What I really missed was a step-by-step guide to integrate everything. It is not difficult but you have to read from several web pages to get to a point where you can start working on your app and not worry anymore about how to deliver your release. Going through the process, I captured all my steps and here they are.

## Prereqs

1. Make sure the XCode command line tools are installed
   ```sh
   xcode-select --install
   ```
1. Connect to your Apple developer account, ensure you have accepted all the latest agreements - otherwise fastlane may fail and ask you to go approve those

## Start with a new project

1. Create a new project in XCode.
1. Set `CFBundleIconName` to `AppIcon` in the bundle Info.plist key as described in [this Apple article](http://help.apple.com/xcode/mac/current/#/dev10510b1f7).
1. Set `ITSAppUsesNonExemptEncryption` to `false` - you may change it later if you plan to use any encryption.
1. Commit the project to a new Git repository

## Enable Cocoapods

1. Install Cocoapods:
   ```sh
   gem install cocoapods
   ```   
1. Initialize the project:
   ```sh
   pod init
   pod install
   ```
1. Cocoapods creates a new workspace. From now own, use the workspace when working on the app.
1. Commit the new files

## Fastlane

1. Install fastlane:
   ```
   gem install fastlane -NV
   ```
1. Initialize the project with fastlane:
   ```sh
   fastlane init
   ```
1. When prompted, pick **Automate beta upload to TestFlight**.
1. Open the app workspace in XCode and enable automatic version and build numbers following [the instructions in this Apple article](https://developer.apple.com/library/archive/qa/qa1827/_index.html).
1. Create `resources/beta-changelog.txt` to hold information targeted to beta users about what has changed
1. Create `resources/beta-app.json` with
   ```json
   {
     "description": "First beta build",
     "feedbackEmail": "yourmail@domain.com"
   }
   ```
1. Open **Fastfile** and change the **beta** lane to
   ```ruby
   lane :beta do
     changelog = File.read("../resources/beta-changelog.txt")
     beta = JSON.parse(File.read("../resources/beta-app.json"))

     ensure_git_status_clean # comment if not using git
     increment_build_number # automatically increment the build number
     commit_version_bump # comment if not using git
     add_git_tag # comment if not using git
     push_to_git_remote # comment if not using git
     
     build_app(workspace: "myapp.xcworkspace", scheme: "myapp")
     upload_to_testflight(
       changelog: changelog,
       beta_app_description: beta["description"],
       beta_app_feedback_email: beta["feedbackEmail"]
     )
   end
   ```
1. Commit the files

## Certificate Management

**fastlane** simplifies the management of app certificates with **match**.

1. Create a Git repo to host the certificates. Make note of the repo Git url and make sure you will be able to commit to this repo
1. Enable **fastlane match** to handle certificates
   ```sh
   bundle exec fastlane match init
   ```
   This will prompt for the certificate repository
1. Setup certificates for the different stages:
   1. `bundle exec fastlane match development`
   1. `bundle exec fastlane match appstore`
   1. `bundle exec fastlane match adhoc`
1. Confirm that new files have been created in the certificates Git repo
1. Edit the XCode workspace and uncheck "Automatically manage signing" in the project "General" tab
1. Select the provisioning profile created above (_match for development_ as example)
1. Commit all changes

## App Icon generation

**fastlane** has a nice plugin to generate all different icon sizes from one master icon.

1. Create a large version (1024x1024) of your app icon
1. Add the **icon** plugin
   ```sh
   bundle exec fastlane add_plugin appicon
   ```
1. Add a new lane in Fastfile to generate all icons
   ```ruby
   lane :icon do
     appicon(
       appicon_image_file: 'resources/AppIcon.png',
       appicon_devices: [ :ipad, :iphone, :ios_marketing,  :watch, :watch_marketing ],
       appicon_path: 'myapp/Assets.xcassets')
   end
   ```
1. Generate the icons
   ```sh
   bundle exec fastlane icon
   ```
1. Commit all changes

## First Beta Build

1. Build and push the first beta
   ```sh
   bundle exec fastlane beta
   ```
   The build may prompt from your mac password to access the keychain.
1. Wait and don't interrupt the script
1. After a while the build is available in TestFlight for users

## The end

You should read about **fastlane** to understand how it works and all the options. Of course, you could also decide to not use **fastlane**. Everything **fastlane** does could be done directly with the Apple tools like XCode. **fastlane** is _mainly_ wrapping all the commands for you - this also means **fastlane** has to catch up with Apple whenever they change an API or make a new parameter required.