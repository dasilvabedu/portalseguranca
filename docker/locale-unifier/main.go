package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v2"
	"github.com/imdario/mergo"
)

func main() {
	var err error
	localesDir := os.Args[1]
	mergedYaml := make(map[interface{}]interface{})

	err = filepath.Walk(localesDir,
		func(path string, _ os.FileInfo, err error) error {
			if err != nil {
				panic(err)
			}

			if strings.Contains(path, ".yml") {
				yamlMap := make(map[interface{}]interface{})
				yamlData, err := ioutil.ReadFile(path)
				if err != nil {
					panic(err)
				}

				err = yaml.Unmarshal(yamlData, &yamlMap)
				if err != nil {
					panic(err)
				}

				mergo.Merge(&mergedYaml, yamlMap)
			}

			return nil
		})

	if err != nil {
		panic(err)
	}

	mergedYamlText, err := yaml.Marshal(&mergedYaml)
	if err != nil {
		panic(err)
	}

	ioutil.WriteFile(
		fmt.Sprintf(
			"/destination/%s",
			os.Getenv("MERGED_LOCALE_FILENAME")),
		mergedYamlText,
		0644)
}
