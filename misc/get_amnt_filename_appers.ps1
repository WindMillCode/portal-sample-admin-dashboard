$param = $args[0]
$files = gci $param -Recurse
$counter = 0
foreach ($file in $files)
{
    #Write-Host "$folder"



    if ($file.name.Contains("youtube_url"))
    {
        $folderPath =  Split-Path $file.fullname -parent
        $folder = Split-Path $folderPath -leaf

        Write-Host $folder
        $counter = $counter + 1
    }


}
Write-Host $counter
